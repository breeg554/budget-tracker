import supertest from 'supertest';
import { HttpStatus } from '@nestjs/common';

export function itShouldReturnNotFound(
  request: () => supertest.Test,
  args?: { description?: string },
) {
  it(args?.description ?? `should return 404`, async () => {
    await request().expect(HttpStatus.NOT_FOUND);
  });
}

export function itShouldReturnUnauthorized(request: () => supertest.Test) {
  it('should return 401', async () => {
    await request().expect(HttpStatus.UNAUTHORIZED);
  });
}

export function itShouldReturnOk(request: () => supertest.Test) {
  it('should return 200', async () => {
    await request().expect(HttpStatus.OK);
  });
}

export function itShouldReturnCreated(request: () => supertest.Test) {
  it('should return 201', async () => {
    await request().expect(HttpStatus.CREATED);
  });
}
