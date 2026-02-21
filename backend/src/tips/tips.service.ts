import { Injectable } from '@nestjs/common';

@Injectable()
export class TipsService {
  getTips() {
    return {
      title: 'Tip of the day',
      content:
        "Rinse milk containers before storage to ensure that they don't smell.",
    };
  }
}
