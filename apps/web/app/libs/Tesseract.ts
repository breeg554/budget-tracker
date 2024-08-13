import { createWorker } from 'tesseract.js';

import { assert } from '~/utils/assert';

class Tesseract {
  private worker: Tesseract.Worker | undefined;

  public async createWorker(lang = 'pol') {
    this.worker = await createWorker(lang);

    return this;
  }

  public async recognize(image: string) {
    assert(this.worker, 'Tesseracts worker not initialised');

    const {
      data: { text },
    } = await this.worker.recognize(image, {}, { text: true });

    return text;
  }

  public async closeWorker() {
    assert(this.worker, 'Tesseracts worker not initialised');
    return this.worker.terminate();
  }

  public async getText(image: string) {
    await this.createWorker();

    const text = await this.recognize(image);

    await this.closeWorker();

    return text;
  }
}

export const tesseract = () => new Tesseract();
