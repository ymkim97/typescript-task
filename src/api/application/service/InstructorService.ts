import { singleton } from 'tsyringe';

import InstructorRepository from '@repository/InstructorRepository';

@singleton()
export default class InstructorService {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  public async isExist(id: number): Promise<boolean> {
    const instructor = await this.instructorRepository.findById(id);

    if (!instructor) return false;

    return true;
  }
}
