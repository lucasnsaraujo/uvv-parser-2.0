import TeachersRepository from "../repositories/TeachersRepository.js";

class TeacherController {
  async index(request, response) {
    const teachers = await TeachersRepository.findAll();
    return response.status(200).json(teachers);
  }
  async show(request, response) {
    const { id } = request.params;
    const teacher = await TeachersRepository.findById(id);
    return response.status(200).json(teacher);
  }
  async store(request, response) {
    const { name } = request.body;
    const teacher = await TeachersRepository.createTeacher({ name });
    return response.status(200).json(teacher);
  }
}

export default new TeacherController();
