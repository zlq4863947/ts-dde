import { Server } from '../';
import * as assert from 'power-assert';

const testInvok = (done: any) => {
  assert(true);
  done();
}


describe('DDE服务端测试', () => {

  it('测试是否执行', testInvok);

});
