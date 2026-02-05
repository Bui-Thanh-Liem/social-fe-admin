import { ETweetStatus } from "~/shared/enums/status.enum";
import type { ETweetType } from "../enums/type.enum";
import type { IBase } from "./base.interface";
import type { IMediaBare } from "./media.interface";
import type { ETweetAudience } from "../enums/common.enum";

export interface ICodesTweet {
  _id: string;
  code: string;
}

export interface ITweet extends IBase {
  user_id: string;
  type: ETweetType;
  audience: ETweetAudience;
  content: string;
  parent_id: null | string; // null khi là tweet gốc
  hashtags: string[];
  status: ETweetStatus;
  mentions: string[]; // nhắc đến
  medias: IMediaBare[] | null;
  guest_view: number;
  user_view: number;
  likes_count: number;
  comments_count: number;
  textColor: string; // màu chữ
  bgColor: string; // màu nền
  codes: ICodesTweet[] | null; // mã code nếu có

  //
  community_id: null | string;

  //
  shares_count?: number;
  retweets_count?: number;
  quotes_count?: number;
  is_like?: boolean;
  is_bookmark?: boolean;
  retweet?: string; // id retWeet của tôi
  quote?: string; // // id quoteTweet của tôi
  total_views?: number;
}
