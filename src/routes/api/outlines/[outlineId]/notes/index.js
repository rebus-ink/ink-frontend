import got from "got";
import crypto from "crypto";
import { note } from "../../../../../stores";
export async function patch(req, res, next) {
  const url = `${process.env.API_SERVER}outlines/${req.params.outlineId}/notes/${req.body.shortId}`;
  delete req.body.shortId;
    // not sure why this is needed. Probably something wrong with the backend?
    if (!req.body.previous) req.body.previous = null;
    if (!req.body.next) req.body.next = null;
    if (!req.body.parentId) req.body.parentId = null;
  try {
    const response = await got.patch(url, {
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${req.user.token}`,
      },
      json: req.body,
    });
    return res.sendStatus(response.statusCode);
  } catch (err) {
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}

export async function post(req, res, next) {
  const hasId = req.body.fresh ? "" : `?source=${req.body.oldId}`;
  const url = `${process.env.API_SERVER}outlines/${req.params.outlineId}/notes${hasId}`;
  //delete req.body.shortId;
  delete req.body.id;
  delete req.body.fresh;
  delete req.body.oldId;
  delete req.body.contextId;
  delete req.body.display;
  // not sure why this is needed. Probably something wrong with the backend?
  if (!req.body.previous) req.body.previous = null;
  if (!req.body.next) req.body.next = null;
  if (!req.body.parentId) req.body.parentId = null;
  try {
    const response = await got.post(url, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${req.user.token}`,
      },
      json: req.body, 
    });
    let body = JSON.parse(response.body)
    return res.sendStatus(response.statusCode);
  } catch (err) {
    console.log(err);
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}

export async function del(req, res, next) {
  try {
    const response = await got
      .delete(
        `${process.env.API_SERVER}outlines/${req.params.outlineId}/notes/${req.body.shortId}`,
        {
          headers: {
            Authorization: `Bearer ${req.user.token}`,
          },
        }
      )
      .json();
    return res.json(response);
  } catch (err) {
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}
