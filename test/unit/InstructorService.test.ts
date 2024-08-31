import { anyNumber, instance, mock, when } from '@johanblumenberg/ts-mockito';

import { Instructor } from '@entity/Instructor';
import InstructorRepository from '@repository/InstructorRepository';
import InstructorService from '@service/InstructorService';

const stubRepository: InstructorRepository = mock(InstructorRepository);
const instructorService = new InstructorService(instance(stubRepository));

describe('강사 존재 확인', () => {
  it('강사가 존재하면 true 반환', async () => {
    // given
    const instructor = new Instructor(1, '테스트 네임');
    when(stubRepository.findById(1)).thenResolve(instructor);

    // when
    const actual = await instructorService.isExist(1);

    // then
    expect(actual).toBe(true);
  });

  it('강사가 존재하지 않으면 false 반환', async () => {
    // given
    when(stubRepository.findById(anyNumber())).thenResolve();

    // when
    const actual = await instructorService.isExist(1);

    // then
    expect(actual).toBe(false);
  });
});
