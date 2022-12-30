import puppeteer from "puppeteer";
import PostsRepository from "../repositories/PostsRepository.js";

const LOGIN_PAGE_URL = "https://aluno.uvv.br/";

const POST_BASE_URL = "https://aluno.uvv.br/Aluno/Post/";
const LAST_KNOWN_POST = 693715;

const { CURRENT_ENV } = process.env;

const RESTART_INTERVAL = 500; // posts

const credentials = ["production", "development"].includes(CURRENT_ENV)
  ? { login: process.env.USER_LOGIN, password: process.env.USER_PASSWORD }
  : localLogin;

async function first_crawler(credentials, options) {
  const BROWSER_OPTIONS = {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
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
  let browser = await puppeteer.launch(BROWSER_OPTIONS);
  var page = await browser.newPage();
  await page.goto(LOGIN_PAGE_URL, NAVIGATION_OPTIONS);
  console.log("> Entered login page");

  await login();

  console.log("> Logged in");

  const last_registered_post = await PostsRepository.findLastPost();
  const starting_id = last_registered_post?.post_id
    ? Number(last_registered_post?.post_id) + 1
    : 1;
  console.log("> Starting from " + starting_id);
  for (
    let current_page = starting_id;
    current_page < starting_id + RESTART_INTERVAL;
    current_page++
  ) {
    const isAskingForLogin = await checkIfLoggedOut();
    if (isAskingForLogin) {
      console.log("> Asking for login.");
      await login();
    }
    try {
      const { comments, subject, teacher, title, post_url } = await crawlPage(
        current_page
      );
      await PostsRepository.createPost({
        title,
        subject: subject.name,
        subject_url: subject.link,
        teacher,
        comments: JSON.stringify(comments),
        post_url,
        post_id: current_page,
      });
    } catch (error) {
      console.log(`Error on post ${current_page}. Going on to the next...`);
    }
  }

  await browser.close();
}

async function crawler(credentials, options) {
  for (
    let count = 0;
    count < Math.floor(LAST_KNOWN_POST / RESTART_INTERVAL);
    count++
  ) {
    if (count > 0) {
      console.log("> Restarting browser");
    }
    await first_crawler(credentials, options);
  }
}

export { crawler };
