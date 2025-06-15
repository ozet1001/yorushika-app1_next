interface Song {
  // 基本情報
  id: string;
  name: string;
  kana: string;
  album: string;
  year: string;
  song_info: string;
  lyrics: string;
  mv_url: string;
  photo: string;
  analysis: string;
  
  // 管理情報
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  
  // 写真クレジット
  photo_account_name: string;
  photo_account_url: string;
  
  // 参考リンク
  reference_list: {
    reference_url_1: string;
    reference_url_2: string;
    reference_url_3: string;
  };
  
  // タイアップ情報
  tieup_info: {
    tieup_info_1: {
      tieup_name: string;
      tieup_url: string;
    };
    tieup_info_2: {
      tieup_name: string;
      tieup_url: string;
    };
    tieup_info_3: {
      tieup_name: string;
      tieup_url: string;
    };
  };
  
  // ファンアート
  fan_art: {
    fan_art_title: string;
    fan_art_url: string;
    fan_art_account_name: string;
    fan_art_account_url: string;
  };
  
  // 関連グッズ
  goods: {
    goods_1: {
      goods_info: string;
      goods_name: string;
      goods_url: string;
    };
    goods_2: {
      goods_info: string;
      goods_name: string;
      goods_url: string;
    };
    goods_3: {
      goods_info: string;
      goods_name: string;
      goods_url: string;
    };
  };
  
  // 関連文学作品
  literatures: {
    literatures_1: {
      author: string;
      url: string;
      work_name: string;
    };
    literatures_2: {
      author: string;
      url: string;
      work_name: string;
    };
    literatures_3: {
      author: string;
      url: string;
      work_name: string;
    };
  };
  
  // 聖地・ロケ地情報
  holy_locations: {
    holy_locations_1: {
      location_address: string;
      location_name: string;
      location_url: string;
      location_img_1: string;
      location_img_2: string;
      location_img_3: string;
      location_img_1_account_name: string;
      location_img_1_account_url: string;
      location_img_2_account_name: string;
      location_img_2_account_url: string;
      location_img_3_account_name: string;
      location_img_3_account_url: string;
    };
    holy_locations_2: {
      location_address: string;
      location_name: string;
      location_url: string;
      location_img_1: string;
      location_img_2: string;
      location_img_3: string;
      location_img_1_account_name: string;
      location_img_1_account_url: string;
      location_img_2_account_name: string;
      location_img_2_account_url: string;
      location_img_3_account_name: string;
      location_img_3_account_url: string;
    };
    holy_locations_3: {
      location_address: string;
      location_name: string;
      location_url: string;
      location_img_1: string;
      location_img_2: string;
      location_img_3: string;
      location_img_1_account_name: string;
      location_img_1_account_url: string;
      location_img_2_account_name: string;
      location_img_2_account_url: string;
      location_img_3_account_name: string;
      location_img_3_account_url: string;
    };
  };
}

export type { Song };