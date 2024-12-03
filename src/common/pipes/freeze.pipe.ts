import { Injectable, Logger, PipeTransform } from "@nestjs/common";

@Injectable()
export class FreezePipe implements PipeTransform {
  transform(value: any): any {
    return Object.freeze(value);
  }
}
