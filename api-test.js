// import necessary module
import { check } from "k6";
import http from "k6/http";

export const options = {
    // define thresholds
    thresholds: {
        http_req_failed: [{ threshold: "rate<0.01", abortOnFail: true }], // http errors should be less than 1%, otherwise abort the test

        // http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(99)<1000'], // 99% of requests should be below 1s
    },
    // define scenarios
    scenarios: {
        // arbitrary name of scenario
        average_load: {
        executor: "ramping-vus",
        stages: [
            { duration: "10s", target: 20 },
            { duration: "50s", target: 20 },
            { duration: "50s", target: 40 },
            { duration: "50s", target: 60 },
            { duration: "50s", target: 80 },
            { duration: "50s", target: 100 },
            { duration: "50s", target: 120 },
            { duration: "50s", target: 140 },
            //....
        ],
      },
    }
};

  
export default function () {

  // define URL and payload
  const url = "https://test-api.k6.io/auth/basic/login/";
  const payload = JSON.stringify({
    username: "test_case",
    password: "1234",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    //apply tags
    tags: {
        "my-custom-tag": "auth-api"
    },
  };

  // send a post request and save response as a variable
  const res = http.post(url, payload, params);
  // check that response is 200
  check(res, {
    "response code was 200": (res) => res.status == 200,
    });
}