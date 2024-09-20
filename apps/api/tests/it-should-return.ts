import supertest from 'supertest';
import { HttpStatus } from '@nestjs/common';

export function itShouldReturn404(
  description: string,
  request: () => supertest.Test,
) {
  it(`should return 404 ${description}`, async () => {
    await request().expect(HttpStatus.NOT_FOUND);
  });
}

export function itShouldReturn401(
  description: string,
  request: () => supertest.Test,
) {
  it(`should return 401 ${description}`, async () => {
    await request().expect(HttpStatus.UNAUTHORIZED);
  });
}

export function itShouldReturn200(
  description: string,
  request: () => supertest.Test,
) {
  it(`should return 200 ${description}`, async () => {
    await request().expect(HttpStatus.OK);
  });
}

export function itShouldReturn201(
  description: string,
  request: () => supertest.Test,
) {
  it(`should return 201 ${description}`, async () => {
    await request().expect(HttpStatus.CREATED);
  });
}
