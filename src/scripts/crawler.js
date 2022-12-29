import puppeteer from "puppeteer";
import PostsRepository from "../repositories/PostsRepository.js";

const LOGIN_PAGE_URL = "https://aluno.uvv.br/";

const POST_BASE_URL = "https://aluno.uvv.br/Aluno/Post/";
const LAST_KNOWN_POST = 693715;

const { CURRENT_ENV } = process.env;

// APAGA ESSA MIZERA
const localLogin = {
  login: "202088349",
  password: "03100123",
};

const credentials = ["production", "development"].includes(CURRENT_ENV)
  ? { login: process.env.USER_LOGIN, password: process.env.USER_PASSWORD }
  : localLogin;

async function crawler(credentials, options) {
  const BROWSER_OPTIONS = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  const NAVIGATION_OPTIONS = {
    waitUntil: "networkidle2",
    timeout: 300000,
  };

  async function login() {
    await page.type("#Matricula", credentials.login);
    await page.type("#Password", credentials.password);

    await Promise.all([
      page.click(".input-block-level"),
      page.waitForNavigation(NAVIGATION_OPTIONS),
    ]);
  }

  async function checkIfLoggedOut() {
    const isAskingForLogin = await page.evaluate(() => {
      let element = document.querySelector("#Matricula");
      return element ? element.innerHTML : null;
    });
    return isAskingForLogin;
  }

  async function crawlPage(current_page) {
    await page.goto(`${POST_BASE_URL}${current_page}`, {
      waitUntil: "networkidle0",
      timeout: 300000,
    });
    const subject = await page.$eval(
      ".breadcrumb li:nth-child(2) a",
      (item) => ({
        name: item.innerText,
        link: item.href,
      })
    );
    const title = await page.$eval(".page-header", (item) =>
      item.innerText.toString().replaceAll('"', "").replaceAll("//", "")
    );
    const teacher = await page.$eval(
      "h4.pull-left > strong",
      (item) => item.innerText
    );
    const comments = await page.$$eval(".box-conversas", (items) =>
      items.map((item) => {
        const user = item.getElementsByTagName("h4")[0].innerText;
        const comment = item.getElementsByTagName("p")[0].innerText;
        return { user, comment };
      })
    );
    console.log(`✔ Parsed post n° ${current_page}!`);
    return {
      subject,
      title,
      teacher,
      comments,
      post_url: `${POST_BASE_URL}${current_page}`,
    };
  }

  // Starting browser
  const browser = await puppeteer.launch(BROWSER_OPTIONS);
  const page = await browser.newPage();
  await page.goto(LOGIN_PAGE_URL, NAVIGATION_OPTIONS);
  console.log("> Entered login page");

  await login();

  console.log("> Logged in");

  const last_registered_post = await PostsRepository.findLastPost();
  console.log({ last_registered_post });
  const starting_id = last_registered_post?.post_id
    ? Number(last_registered_post?.post_id) + 1
    : 1;
  console.log(starting_id);

  for (
    let current_page = starting_id;
    current_page < LAST_KNOWN_POST;
    current_page++
  ) {
    console.log("> Continuing from " + current_page);
    const isAskingForLogin = await checkIfLoggedOut();
    if (isAskingForLogin) await login();
    try {
      const { comments, content, subject, teacher, title, post_url } =
        await crawlPage(current_page);
      await PostsRepository.createPost({
        title,
        subject: subject.name,
        subject_url: subject.link,
        teacher,
        comments: JSON.stringify(comments),
        post_url,
        post_id: current_page,
      });
      console.log("> Post registrado no banco.");
    } catch (error) {
      console.log(`Error on post ${current_page}. Going on to the next...`);
    }
  }

  await browser.close();
}

export { crawler };
