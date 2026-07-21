import { jest } from "@jest/globals";

export const createRequest = ({ body = {}, params = {}, cookies = {}, file, user, log } = {}) => ({
  body,
  params,
  cookies,
  file,
  user,
  log,
});

export const createResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendFile = jest.fn();
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);

  return res;
};
