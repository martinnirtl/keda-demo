import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get(__ENV.GREETING_SERVICE_BASEURL + '/hello/martin');
  sleep(1);
}
