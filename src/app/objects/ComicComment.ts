
export interface ComicComment {

  commentGuid: string;
  body: string;
  author: string;
  createDt: Date;
  // For security purposes
  answer?: string;

}

/*
self.comment_id = model.comment_id
self.comment_guid = model.comment_guid
self.page_id = model.page_id
self.body = model.body
self.author = model.author
self.author_ip = model.author_ip
self.status = model.status
self.create_dt = model.create_dt
self.update_dt = model.create_dt
*/
