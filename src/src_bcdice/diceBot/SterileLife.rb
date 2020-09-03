# -*- coding: utf-8 -*-
# frozen_string_literal: true

class SterileLife < DiceBot
  # ゲームシステムの識別子
  ID = 'SterileLife'

  # ゲームシステム名
  NAME = 'ステラーライフTRPG'

  # ゲームシステム名の読みがな
  SORT_KEY = 'すてらあらいふTRPG'

  # ダイスボットの使い方
  HELP_MESSAGE = <<MESSAGETEXT
◆判定　nDAc[s,d,t]　n:ダイス数　c:各種修正　s:1成功（省略不可）　d:2成功（省略不可）　t:3成功（ダイス目一致時のみ　省略時:無し）
　例）2DA-3[7,10]
◆船名ランダム表
　・船名接頭辞表　VPFT
　・船名前半表　VNFT
　・船名後半表　VNRT
　・アバターアルファベット表①　AAFT
　・アバターアルファベット表②　AAST
◆ヴォヤージュ各種表
　・ランダムNPC艦表　RNST
　・ランダムイベント表　RET
　・お宝特徴表　TRST
　・お宝形容表　TRAT
　・お宝外見表　TRMT
　・お宝物品表　TROT
◆ステラーライフお題表
　・超未来の技術　TET
　・超未来のエンタメ　ENT
　・超未来の文化　CUT
　・超未来の自然　NAT
　・超未来の宇宙船内　INT
MESSAGETEXT

  setPrefixes(['(\d+)*DA.*\[(\d+),(\d+)(,(\d+))?\]', 'VPFT', 'VNFT', 'VNRT', 'AAFT', 'AST', 'RNST', 'RET', 'TRST', 'TRAT', 'TRMT', 'TROT', 'TET', 'ENT', 'CUT', 'NAT', 'INT']) # '(\d+)*DA.*\[.*\]'

  def rollDiceCommand(command) # ダイスロールコマンド
    # 通常判定部分をgetJudgeResultコマンドに切り分け
    output = getJudgeResult(command)
    return output unless output.nil?

    # テーブル
    result = '0'
    type = ""
    total_n = ""

    case command.upcase # 大文字にしてチェックする
    when 'VPFT'
      type = '船名接頭辞表'
      result, total_n = get_shipprefix_table
    when 'VNFT'
      type = '船名前半表'
      result, total_n = get_shipnameformer_table
    when 'VNRT'
      type = '船名後半表'
      result, total_n = get_shipnamelatter_table
    when 'AAFT'
      type = 'アバターアルファベット表①'
      result, total_n = get_avataralphabetfirst_table
    when 'AAST'
      type = 'アバターアルファベット表②'
      result, total_n = get_avataralphabetsecond_table
    when 'RNST'
      type = 'ランダムNPC艦表'
      result, total_n = get_randomnpcship_table
    when 'RET'
      type = 'ランダムイベント表'
      result, total_n = get_randomevent_table
    when 'TRST'
      type = 'お宝特徴表'
      result, total_n = get_treasurespec_table
    when 'TRAT'
      type = 'お宝形容表'
      result, total_n = get_treasureappearance_table
    when 'TRMT'
      type = 'お宝外見表'
      result, total_n = get_treasurematerial_table
    when 'TROT'
      type = 'お宝物品表'
      result, total_n = get_treasureobject_table
    when 'TET'
      type = '超未来の技術'
      result, total_n = get_sftechnology_table
    when 'ENT'
      type = '超未来のエンタメ'
      result, total_n = get_sfentertainment_table
    when 'CUT'
      type = '超未来の文化'
      result, total_n = get_sfculture_table
    when 'NAT'
      type = '超未来の自然'
      result, total_n = get_sfnature_table
    when 'INT'
      type = '超未来の宇宙船内'
      result, total_n = get_sfinterior_table
    end
    return "#{type}(#{total_n}) ＞ #{result}"
  end

  def getJudgeResult(command)
    case command
    when /(\d+)*DA([\d\+\*\-]*[\d])?\[(\d+),(\d+)(,(\d+))?\]/i
      number = (Regexp.last_match(1) || 1).to_i
      correction = (Regexp.last_match(2) || 0).to_i
      single = (Regexp.last_match(3) || 4).to_i
      double = (Regexp.last_match(4) || 8).to_i
      triple = (Regexp.last_match(6) || -1).to_i
    else
      return nil
    end # ^は行頭 $は行末 iは大文字小文字区別しない https://ruby-doc.org/core-2.7.0/Regexp.html

    success = 0
    dicetext = ""
    corrected = ""

    if number <= 0 then number = 1 end

    number.times do
      dice, = roll(1, 10)[0] - 1
      if (dice + correction).to_i >= single || dice == triple then success += 1 end
      if (dice + correction).to_i >= double || dice == triple then success += 1 end
      if dice == triple then success += 1 end # unless triple == -1 3成功はダイス目一致時のみ
      if dicetext == ""
        dicetext = dice.to_s
        corrected = (dice + correction).to_s
      else
        dicetext = dicetext + "," + dice.to_s
        corrected = corrected + "," + (dice + correction).to_s
      end
    end

    if correction == 0
      result = "(#{dicetext}) ＞ 成功数#{success}"
    end

    if correction > 0
      result = "(#{dicetext}) +#{correction} ＞ (#{corrected}) ＞ 成功数#{success}"
    end

    if correction < 0
      result = "(#{dicetext}) #{correction} ＞ (#{corrected}) ＞ 成功数#{success}"
    end

    return result
  end

  # 1D10 ロール用
  def get_table_by_1d10(table)
    dice, = roll(1, 10)

    text = table[dice - 1]

    indexText = (dice - 1).to_s

    return '1', indexText if text.nil?

    return text, indexText
  end

  # D1010 ロール用
  def get_table_by_d1010(table)
    dice1, = roll(1, 10)
    dice2, = roll(1, 10)

    num = (dice1 - 1) * 10 + (dice2 - 1)

    text = table[num]

    indexText = "#{dice1 - 1}#{dice2 - 1}"

    return '1', indexText if text.nil?

    return text, indexText
  end

  # D510 ロール用
  def get_table_by_d510(table)
    dice1, = roll(1, 10)
    dice2, = roll(1, 10)

    num = ((dice1 - 1) / 2) * 10 + (dice2 - 1)

    text = table[num]

    indexText = "#{dice1 - 1}#{dice2 - 1}"

    return '1', indexText if text.nil?

    return text, indexText
  end

  # 船名接頭辞表
  def get_shipprefix_table
    table = [
      'ISS(独立宇宙船)',
      'PCS(惑星運搬船)',
      'NSS(中立星間船)',
      'SMS(星間商船)',
      'PSS(民間宇宙船)',
      'CIS(勅許独立船)',
      'FTS(自由貿易船)',
      'OES(外縁探検船)',
      'SSS(主権星間船)',
      'HMS(陛下の船)'
    ]
    return get_table_by_1d10(table)
  end

  # 船名前半表
  def get_shipnameformer_table
    table = [
      'ブラック', 'ホワイト', 'レッド', 'ブルー', 'グリーン', 'パープル', 'ライラック', 'ブラウン', 'シルバー', 'ゴールド',
      'ネイビー', 'マリン', 'オーシャン', 'アクア', 'セイル', 'アンカー', 'パイレーツ', 'プライヴァティア', 'アルマダ', 'フロティラ',
      'ギャリソン', 'タンク', 'センチネル', 'スクァッド', 'トループ', 'フロント', 'オフェンシブ', 'ヴァンガード', 'オーダー', 'フラッグ',
      'ゲイザー', 'アストロ', 'ステラー', 'ギャラクティック', 'スターリー', 'ミルキー', 'プラネタリー', 'ゾディアック', 'ポラリス', 'イクェータ',
      'アイアンクラッド', 'サイエンス', 'ストーン', 'ソリッド', 'ウッド', 'ストック', 'フロー', 'ブレイズ', 'ディヴァイン', 'グロリアス',
      'ドラゴン', 'コヨーテ', 'ペガサス', 'カーバンクル', 'ガーゴイル', 'バジリスク', 'フェニックス', 'フェンリル', 'ケルベロス', 'キマイラ',
      'ジュラフ', 'ディアー', 'ゼブラ', 'ホエール', 'ラクーン', 'キャメル', 'ペンギン', 'リザード', 'サーバル', 'エルク',
      'フリー', 'ライト', 'リベラル', 'リッチ', 'エコノミー', 'マーケット', 'ナショナル', 'ソーシャル', 'エコロジカル', 'ナチュラル',
      'ロイヤル', 'プリンシパル', 'インペリアル', 'マジェスティック', 'ノーブル', 'ロード', 'ハイネス', 'デューク', 'カウント', 'バロン',
      'スモーク', 'クリア', 'ブリザード', 'ゲイル', 'ミスト', 'ヘイル', 'スノウ', 'ライトニング', 'サンダー', '(PC1人の名前)'
    ]
    return get_table_by_d1010(table)
  end

  # 船名後半表
  def get_shipnamelatter_table
    table = [
      'ローズ', 'ダンデリオン', 'オーキッド', 'アザリア', 'スウォードリリー', 'アイリス', 'ラベンダー', 'プロテア', 'グラジオラス', 'マグノリア',
      'ライナー', 'カッター', 'フライター', 'フェリー', 'バルジ', 'クルーザー', 'クラフト', 'リガー', 'キール', 'ヴェッセル',
      'リミテッド', 'インク', 'マーチャント', 'エクスペディション', 'コンボイ', 'キャラバン', 'コマース', 'レティニュー', 'アドバイザリー', 'コンサルティング',
      'テレスコープ', 'オブザーバー', 'グラス', 'コスモス', 'ヘブン', 'ノート', 'ロット', 'スペースフェアラー', 'ノマド',
      'ブローカー', 'ディーラー', 'ダイバー', 'ドライバー', 'アドベンチャラー', 'ランナー', 'ウォーカー', 'トラベラー', 'トレーダー', 'エクスプローラー',
      'キャット', 'パンサー', 'ライオン', 'ピューマ', 'レオパルド', 'タイガー', 'ジャガー', 'オセロット', 'リンクス', 'チーター',
      'ウォルフ', 'カメレオン', 'クラブ', 'オスカー', 'シャーク', 'イーグル', 'コンドル', 'ドルフィン', 'サウルス', 'フィッシュ',
      'コンキスタドール', 'フサリア', 'ナイト', 'コサック', 'ヘタイロイ', 'バーサーカー', 'レギオン', 'ウォリアー', 'テルシオ', 'ライダー',
      'ルール', 'ディメイン', 'レイン', 'ジャスティス', 'エンクレーブ', 'ステート', 'カントリー', 'レルム', 'ドミニオン', 'ソブリン',
      'ストーム', 'テンペスト', 'アヴァランチ', 'ストライク', 'フォール', 'クエイク', 'ハリケーン', 'ブラスター', 'ブリザード', '(PC 1人の名前)'
    ]
    return get_table_by_d1010(table)
  end

  # アバターアルファベット表①
  def get_avataralphabetfirst_table
    table = [
      'A', 'F', 'G', 'I', 'J', 'K', 'R', 'S', 'T', 'V'
    ]
    return get_table_by_1d10(table)
  end

  # アバターアルファベット表②
  def get_avataralphabetsecond_table
    table = [
      'D', 'F', 'L', 'M', 'N', 'O', 'R', 'S', 'X', 'Z'
    ]
    return get_table_by_1d10(table)
  end

  # ランダムNPC艦
  def get_randomnpcship_table
    table = [
      '装甲＋20(HP+400)', '装甲＋20(HP+400)', '〈電磁パルスフィールド〉1基', '〈中性粒子ビーム砲〉2基', '〈バリアフィールド〉2基',
      '装甲＋20(HP+400)', '装甲＋20(HP+400)', '〈電磁パルスフィールド〉1基	〈高機動ミサイル〉2基', '〈バリアフィールド〉2基',
      '装甲＋20(HP+400)', '装甲＋20(HP+400)', '〈リサイクルフォージ〉', '〈高機動ミサイル〉2基', '〈バリアフィールド〉2基',
      '装甲＋20(HP+400)', '装甲＋20(HP+400)', '〈リサイクルフォージ〉', '〈高機動ミサイル〉2基', '〈レーザーディフェンス〉2基',
      '装甲＋20(HP+400)', '〈ホーミング量子ビーム〉2基', '〈高圧縮精製装置〉', '〈アタックドローン〉1基	〈レーザーディフェンス〉2基',
      '装甲＋20(HP+400)', '〈ホーミング量子ビーム〉2基', '〈高圧縮精製装置〉', '〈爆縮高エネルギービーム砲〉2基	〈レーザーディフェンス〉2基',
      '装甲＋20(HP+400)', '〈ホーミング量子ビーム〉2基', '〈艦載メタルディテクター〉', '〈マグネティックアロイミサイル〉2基', '〈艦内防護装甲〉',
      '装甲＋20(HP+400)', '〈ロングランスミサイル〉2基', '〈「スターブレイカー」のハリボテ〉', '〈ドローンアバター〉1基	装甲＋40(HP+800)',
      '装甲＋20(HP+400)', '〈ロングランスミサイル〉2基', '〈中性粒子ビーム砲〉2基', '〈拡散粒子ビーム砲〉2基	装甲＋40(HP+800)',
      '装甲＋20(HP+400)', '〈ロングランスミサイル〉2基', '〈中性粒子ビーム砲〉2基', '〈マイクロミサイルポッド〉2基', '装甲＋40(HP+800)'
    ]
    return get_table_by_d510(table)
  end

  # ランダムイベント表
  def get_randomevent_table
    table = [
      # 0
      '燃料1　《周辺探索》成功数0～1では推進剤[1D10×30]獲得', '燃料1　《周辺探索》成功数0～1では推進剤[1D10×30]獲得', '燃料1　《周辺探索》成功数0～1では推進剤[1D10×30]獲得', '燃料1　《周辺探索》成功数0～1では推進剤[1D10×30]獲得', '燃料1　《周辺探索》成功数0～1では推進剤[1D10×30]獲得', '鋼材1　《周辺探索》成功数0～1では鋼材[1D10×30]獲得', '鋼材1　《周辺探索》成功数0～1では鋼材[1D10×30]獲得', '鋼材1　《周辺探索》成功数0～1では鋼材[1D10×30]獲得', '鋼材1　《周辺探索》成功数0～1では鋼材[1D10×30]獲得', '鋼材1　《周辺探索》成功数0～1では鋼材[1D10×30]獲得',
      # 1
      '鋼材1　《周辺探索》成功数0～1では鋼材[1D10×30]獲得', '鋼材1　《周辺探索》成功数0～1では鋼材[1D10×30]獲得', '巨大暗黒星雲　この星系ではビーム属性の攻撃の判定で達成値－1', '超新星残骸　この星系では実体弾属性の攻撃の判定で達成値－1', 'C型アステロイド　推進剤400を獲得', '氷のアステロイド群　推進剤500を獲得', '巨大アイスブロック　推進剤600を獲得', '資源アステロイド　推進剤200、鋼材200を獲得', '枯渇彗星核　実体弾攻撃でダメージ200を出すと推進剤600を獲得', '放棄されたドローン　鋼材200、希少金属1を獲得',
      # 2
      '金属塊　鋼材300を獲得', 'S型アステロイド　鋼材400を獲得', 'S型アステロイド　鋼材400を獲得', 'スペースデブリ　鋼材500を獲得', 'スペースデブリ　鋼材500を獲得', 'M型アステロイド　鋼材600を獲得', '艦船の残骸　鋼材700を獲得', '大資源アステロイド　推進剤300、鋼材300を獲得', '小惑星の欠片　ビーム攻撃でダメージ200を出すと鋼材600を獲得', '希少金属アステロイド　希少金属2を獲得',
      # 3
      '砕けた惑星核　希少金属3を獲得', '燃料1　《周辺探索》成功数0～1では推進剤[1D10×30]獲得', '燃料1　《周辺探索》成功数0～1では推進剤[1D10×30]獲得', '燃料1　《周辺探索》成功数0～1では推進剤[1D10×30]獲得', '燃料1　《周辺探索》成功数0～1では推進剤[1D10×30]獲得', '鋼材1　《周辺探索》成功数0～1では鋼材[1D10×30]獲得', '鋼材1　《周辺探索》成功数0～1では鋼材[1D10×30]獲得', '鋼材1　《周辺探索》成功数0～1では鋼材[1D10×30]獲得', '氷のアステロイド群　推進剤500を獲得', '巨大アイスブロック　推進剤600を獲得',
      # 4
      '大資源アステロイド　推進剤300、鋼材300を獲得', '氷火山アステロイド　推進剤300、希少金属1を獲得', 'オーガニックアステロイド　推進剤700を獲得', '金属塊　鋼材300を獲得', 'スペースデブリ　鋼材500を獲得', 'M型アステロイド　鋼材600を獲得', '放棄されたモジュール　鋼材300、希少金属1を獲得', '砕けた惑星核　希少金属3を獲得', 'レアアースアステロイド　希少金属4を獲得', 'レアアースアステロイド　希少金属4を獲得'
    ]
    return get_table_by_d510(table)
  end

  # お宝特徴表
  def get_treasurespec_table
    table = [
      '恐竜を模した(価値+3)', 'ヘビを模した(価値+1)', '魚を模した(価値+1)', 'イヌを模した(価値+1)', 'ウマを模した(価値+1)', 'ネズミを模した(価値+1)', 'ウサギを模した(価値+1)', 'クマを模した(価値+1)', 'ネコを模した(価値+1)', '鳥を模した(価値+2)',
      '触り心地の良い(価値+1)', 'ふかふかした(価値+1)', 'ふわふわの', '柔らかな', 'なめらかな', 'かすかに震える', 'とげとげした', '硬質な', 'ザラッとした', '持ちやすい(価値+1)',
      '美しい(価値+1)', 'きれいな', '麗しの(価値+1)', '華美な', '派手な', 'ほのかに発光する', '色とりどりの', '鮮やかな', '変化に富む', '可憐な(価値+1)',
      'しゃべる(価値+1)', '泣き声がする', '鳴き声がする', '歌が聞こえる(価値+1)', '音を吸い込む', '静寂の', '聞き上手の', '良い音の', '共鳴する', '響きの良い(価値+1)',
      'おいしい匂いがする(価値+1)', '血の匂いがする', '動物の匂いがする', '草いきれの匂いがする', '上品な香りがする(価値+1)', '目の醒める匂いがする', '甘い匂いがする', '柑橘系の香りがする', '清冽な香りがする', '安らぎの香りがする(価値+1)',
      '好意を感じさせる(価値+1)', '痛みを感じさせる', '怒りを感じさせる', '苦悶を感じさせる', '弱さを感じさせる', '癒やしを感じさせる(価値+1)', '母性を感じさせる', '優しさを感じさせる', '力強さを感じさせる', '年月を感じさせる(価値+1)',
      '洗練された(価値+1)', 'とろけるような', '不安定な', 'まろやかな', '穏やかな', '柔和な', 'オーガニックな(価値+1)', 'ストイックな', 'シンプルな', 'ナチュラルな(価値+1)',
      '気高き(価値+1)', '艶やかな', '気取った', '気位の高い', 'リッチな', '気品漂う', '高潔な', '格調高い(価値+1)', '典雅な', 'ロイヤルな(価値+1)',
      '闇に溶けるような(価値+1)', '血塗られた', '片翼の', '円環の', '「機関」の', 'オッドアイの', '片目の', '堕天使の', '二重人格の(価値+1)', '輝きを纏う(価値+1)',
      '秘密を持つ(価値+2)', 'いわく付きの(価値+1)', '歴史ある(価値+1)', '奪い合われた(価値+1)', '受け継がれた(価値+1)', '失われた文化の(価値+1)', '謎に満ちた(価値+1)', '廃墟で見つかった(価値+1)', 'あのシリーズの1つ(価値+1)', '寵愛を受けた(価値+3)'
    ]
    return get_table_by_d1010(table)
  end

  # お宝形容表
  def get_treasureappearance_table
    table = [
      'ブレスト(価値+3)', 'ホーリー(価値+1)', 'ワンダフル(価値+1)', 'シャイニング(価値+1)', 'スーパー(価値+1)', 'エクセレント(価値+1)', 'グロリアス(価値+1)', 'グレート(価値+1)', 'フラワリー(価値+1)', 'ミラクル(価値+2)',
      'アース(価値+1)', 'サバンナ(価値+1)', 'マウンテン', 'リバー', 'フォレスト', 'ジャングル', 'デザート', 'ハイランド', 'レイク', 'オーシャン(価値+1)',
      'スペース(価値+1)', 'コスモ', 'ワールド(価値+1)', 'ユニバーサル', 'スカイ', 'メテオール', 'コメット', 'ルナティック', 'プラネタリー', 'ステラー(価値+1)',
      'アンティーク(価値+1)', 'エンシェント', 'オールド', 'エルダー(価値+1)', 'カスタム', 'レーテスト', 'アバンギャルド', 'アドバンスト', 'カティングエッジ', 'フューチャー(価値+1)',
      'ダーク(価値+1)', 'ソイル', 'ウォーター', 'アイス', 'フィジカル(価値+1)', 'マインド', 'フレイム', 'ウィンド', 'サンダー', 'ライト(価値+1)',
      '闇の(価値+1)', '土の', '水の', '氷の', '物理', '心の(価値+1)', '炎の', '風の', '雷の', '光の(価値+1)',
      '骨董品の(価値+1)', 'いにしえの', '古き', '長老の', '特注', '最新型', '前衛的(価値+1)', '発展的', '先進的', '未来的(価値+1)',
      '宇宙(価値+1)', '乾坤', '世界', '森羅万象', '空の', '流星の', '隕石の', '月の(価値+1)', '惑星', '星の(価値+1)',
      '大地の(価値+1)', '草原の', '山の', '川の', '森の', '林の', '砂漠の', '高地の', '湖の(価値+1)', '海の(価値+1)',
      '祝福の(価値+2)', '神聖な(価値+1)', '不思議な(価値+1)', '輝かしい(価値+1)', '超(価値+1)', '素晴らしい(価値+1)', '栄光の(価値+1)', '偉大な(価値+1)', '華の(価値+1)', '奇跡の(価値+3)'
    ]
    return get_table_by_d1010(table)
  end

  # お宝外見表
  def get_treasurematerial_table
    table = [
      'ダイヤモンド(価値+3)', 'ジェイド(価値+1)', 'エメラルド(価値+1)', 'トパーズ(価値+1)', 'サファイア(価値+1)', 'ルビー(価値+1)', 'ガーネット(価値+1)', 'ラピスラズリ(価値+1)', 'アメジスト(価値+1)', 'スモーキークォーツ(価値+2)',
      'ゴールデン(価値+1)', 'チタン(価値+1)', 'ブリキの', 'アイアン', 'スチール', '真鍮の', 'ブロンズ', 'カッパー', 'シルバー', 'プラチナ(価値+1)',
      'マーブル(価値+1)', 'グラナイト', 'オブシディアン(価値+1)', 'スレート', 'ライムストーン', 'ガラス', 'リネン', 'ビロード', 'コットン', 'シルク(価値+1)',
      'セラミック(価値+1)', 'プラスチック', 'レンガの', 'カーボン(価値+1)', 'コンクリート', 'クォーツの', 'オークの', 'レッドウッド', 'スプルースの', 'マホガニーの(価値+1)',
      'ブラック(価値+1)', 'オレンジ', 'グレー', 'ブルー', 'マジェンタ(価値+1)', 'グリーン', 'レッド', 'パープル', 'イエロー', 'ホワイト(価値+1)',
      '黒い(価値+1)', '橙の', '灰色の', '青い', 'インディゴ', '緑の(価値+1)', '赤い', '紫の', '黄色い', '白い(価値+1)',
      '磁器の(価値+1)', '陶器の', '粘土の', '紙の', '石膏の', '水晶の', 'チークの(価値+1)', 'ヒノキの', '杉の', 'ウォルナット(価値+1)',
      '大理石の(価値+1)', '御影石の', '黒曜石の', '粘板岩の', '石灰岩の', '玻璃の', '麻の', '天鵞絨の(価値+1)', '綿の', '絹の(価値+1)',
      '黄金の(価値+1)', 'アルミニウム', '錫の', '鉄の', '鋼鉄の', '鉛の', '青銅の', '銅の', '銀の(価値+1)', '白金の(価値+1)',
      '金剛石の(価値+2)', '翡翠の(価値+1)', '翠玉の(価値+1)', '黄玉の(価値+1)', '蒼玉の(価値+1)', '紅玉の(価値+1)', '紅榴石の(価値+1)', '瑠璃の(価値+1)', '紫水晶の(価値+1)', '煙水晶の(価値+3)'
    ]
    return get_table_by_d1010(table)
  end

  # お宝物品表
  def get_treasureobject_table
    table = [
      'フルート(価値+3)', 'オカリナ(価値+1)', 'ギター(価値+1)', 'ピアノ(価値+1)', 'ドラム(価値+1)', 'ティンパニー(価値+1)', '太鼓(価値+1)', 'トランペット(価値+1)', 'ハープ(価値+1)', 'マイク(価値+2)',
      'ブランコ(価値+1)', '人形(価値+1)', 'シーソー', 'ベンチ', 'すべり台', 'ラケット', 'ミニカー', 'コースター', 'ボール', 'オーブ(価値+1)',
      '皿(価値+1)', 'プレート', 'ティーセット(価値+1)', '箸', 'フォーク', 'スプーン', 'ナイフ', 'フライパン', '鍋', 'カップ(価値+1)',
      '王冠(価値+1)', '櫛', 'イヤリング', '首飾り(価値+1)', '腕輪', '指輪', 'ブローチ', 'サークレット', 'チョーカー', '羽飾り(価値+1)',
      'ロッド(価値+1)', 'ウィップ', 'ハンマー', 'アックス', 'ブレイド(価値+1)', 'セイバー', 'シールド', 'クラブ', 'ランス', 'ソード(価値+1)',
      '錫杖(価値+1)', '鞭', '槌', '斧', '刃', '刀(価値+1)', '盾', '棍棒', '槍', '剣(価値+1)',
      '扇(価値+1)', 'ボトル', '燭台', 'ペン', '仮面', 'バッグ', '時計(価値+1)', '傘', '徽章', '鏡(価値+1)',
      'スマートドレス(価値+1)', 'タッチパネル', 'インプットグローブ', 'プロジェクター', 'ディテクター', 'アナライザー', 'インジェクター', 'エアーボトル(価値+1)', 'ワイヤーロンチャー', 'ジェットパック(価値+1)',
      'ランプ(価値+1)', 'ドア', '窓', '灯籠', '棚', 'キッチン', 'ソファ', '椅子', 'テーブル(価値+1)', 'ベッド(価値+1)',
      '人物像(価値+2)', 'フィギュア(価値+1)', 'モデル(価値+1)', '植物像(価値+1)', '動物像(価値+1)', 'レリーフ(価値+1)', 'オブジェ(価値+1)', 'ドーム(価値+1)', 'タペストリー(価値+1)', '絵画(価値+3)'
    ]
    return get_table_by_d1010(table)
  end

  # 超未来の技術
  def get_sftechnology_table
    table = [
      '船の種、家の種、ビルの種：発達したバイオテクノロジーにより、光合成をしながらカーボン製品を作り出す「種」が作られました。土に植えると一軒家に育ったり、立派な木になってコップの実をならせたりします。',
      'ワープリング：星と星の間を結ぶ空間のトンネルを作り出すのが、「ワープリング」です。中に入ると超光速で空間が周回しており、数時間から数日で数光年先の星に辿り着くことができます。',
      '擬似重力発生装置：超未来の宇宙船や宇宙ステーションでは、回転による遠心力などを活用して、擬似的に床に引っ張られる力を発生させています。パラメーターを変えれば、物の重さも体重も思いのままです。',
      'アニマフォーム：ファブリックやマイクロマシンを使って作った人工の「動物」に、ネットワーク接続して「乗り移る」技術です。動物の姿で動物になりきって、自然の中を探索できます。',
      'スマートテクスタイル：布やロープが自由自在に動きます。カーボンナノチューブなどの導電性の素材を織り込むことで繊維自体が電子機器として稼働・変形し、ボタンのセンサーと連動して様々な機能を果たします。',
      'パーソナルバリア：人間の周囲を囲うバリアーで、身体の各所に付けた発生機から生まれた電磁フィールドが宇宙空間を飛び交う危険な宇宙線を防いでくれます。船外活動には必須の装備です。',
      'フィンガーティップデザイン：指と手首を動かしながら頭の中でイメージを作ることで、あっという間に3D のデザインを作成できます。超未来は「繊維やケーブルが動く」ため、モノ作りがかなり複雑になっているのです。',
      'ジェットパック：個人用の強力なジェット噴射機で、誰でも空に飛び上がることができます。長く使っていると高熱を発するので注意。宇宙空間では、これとスマートワイヤーを組み合わせて移動に使います。',
      'メンタルプロジェクション：ヒトの心は、様々な価値観や性格が溶け合う複層的なもの。その複雑な姿を脳波投影で視界に映して、心の整理を付けやすくする技術です。しばしば「天使と悪魔」のビジュアルを付けます。',
      'スライムソファ：球体状の大きなソファで、ポリマーとカーボン素材でできており、自在に変形させたり柔らかさを変えたりできます。床や壁に吸着してくれるため、無重力空間では身体を固定してくれます。'
    ]
    return get_table_by_1d10(table)
  end

  # 超未来のエンタメ
  def get_sfentertainment_table
    table = [
      'ホロシアター：劇場いっぱいにホログラムを展開して、広大な大地や美しい空の上などで大冒険のスペクタクルショーを「その場にいるような」臨場感で楽しむことができます。',
      'アバターファイト！：手の平サイズの小型の人型アバターを思念で操って、ドームの中でバトルを楽しみます。フィールドはホログラム生成で、ビームやミサイルもホログラム再現なので、損傷の心配はありません。',
      'VRゲーム：外接電脳さえ持っていれば、VR ゴーグルがなくても仮想現実世界にダイブできます。圧倒的なリアリティを持つ仮想世界を堪能し、育成や対戦、パズルなど様々なゲームを楽しめます。',
      'ハイド・アンド・シーク：惑星全域を舞台にしたかくれんぼです。第七感覚をフル活用して都市の全域を見て回り、ときには動物たちからも情報を集めながら、この星のどこかにいる鬼を見つけ出しましょう。',
      'アロマバス：リラックスできる香りがいっぱいのお湯に浸かって、心身を癒やします。神経に疲れが溜まる超未来。ハーブの香りを思い切り吸い込んで、緊張を溶きほぐします。',
      'ロジックパズル：外接電脳をフル活用しないと解けないような、難解なパズルに挑戦します。一見すると無関係な2つの要素を組み合わせることで、意外な手がかりが見つかります。',
      'ホロアスレチック：コンクリートや植物性ビルなどを使って組み立てた殺風景なアスレチックを、ホログラムで美しくダイナミックに彩ります。超未来人の高い運動能力を存分に発揮できます。',
      'スカイレース：超未来なので人は空を飛べます。トリブリードは自前の翼で、そうでなくても自分で設計したグライダーなどで、空中にホロ投影されるリングを通過しながら、複雑なコースを高速で飛びます。',
      'ミステリーハウス：宝探しや事件解決など、規定時間以内に「謎」を解くイベントです。屋敷の中には手がかりが散りばめられており、VRでもリアルでも手軽に探偵遊びを楽しむことができます。',
      'SNS：超未来のSNS は濃密にして苛烈！超高速でやり取りが行いながら、惑星の多くの人々と触れ合い交流を深めます。惑星ごとの微妙な文化の違いに注意を払いましょう。'
    ]
    return get_table_by_1d10(table)
  end

  # 超未来の文化
  def get_sfculture_table
    table = [
      'リスペクト・ユー：超未来の社会では、他人に対する「リスペクト」が何より大事にされています。見てもらうこと、尊敬されることを目指して、今日も人々はSNSで活動したり、働いたりします。',
      'マインドミュージック：手を振るうことで感情を音色にする未来的な音楽です。VRやホログラフィと組み合わせれば映像効果も付き、思うままに自分の心から湧き出る音楽を演奏することができます。',
      'レプロドュィーユ：オペラやバレエ、歌舞伎、ミュージカルといった歌劇の血筋を引いた文化です。物語や歴史の登場人物になりきって、身体の動きを正確に制御しつつ音楽を演奏して全身で表現を行います。',
      '物語：小説やアニメムービーなど、誰かが紡いだ物語を追体験します。星系によって異なる文化、異なるトレンドを持っているので、その違いもまた楽しめます。',
      'Deep in myself：深い瞑想をします。静かな落ち着いた空間でゆっくりと精神を集中し、自分の心の中に潜るように意識の状態を変容させ、マインドフルネスを達成します。',
      'ファッションコーデ：自然派やロマン風、モノトーンなど、統一感あるファッションは気品を感じさせます。今日のテーマはどうしましょうか。お部屋の家具も変形して、同じ系統にコーディネートしましょう。',
      '美術品：超未来の絵画や彫刻は、動きます。内部のカーボンナノファイバーやナノマシンが変形することで、あらかじめ制作者がプログラムした動きやインタラクティブな動きを繰り返します。',
      'ガーデニング：平たい土地に植物や柵、椅子や机などの種を植えて、美しい庭を造成します。惑星ごとに異なる気候に適応した様々な固有種を使って、その惑星ならではの花の彩りを演出しましょう。',
      'お料理！：超未来の合成肉や促成栽培野菜などを使って、舌を楽しませるおいしい料理を作りましょう。調理器具は3Dプリンターやクローナイフ、調味料は塩や砂糖、マイクロマシンに香辛料などです。',
      'シリコンオフィス：角張ったオフィス机やタイムカードなど超未来の世界では絶滅しました。人々は家からでも公園からでも木の上や洞窟の中からでもワークに参加しますし、趣味と労働の区別を付けません。'
    ]
    return get_table_by_1d10(table)
  end

  # 超未来の自然
  def get_sfnature_table
    table = [
      'アニマルハート：動物たちの鳴き声の意味を解読し、また脳波分析を組み合わせることで、高等知能動物たちとある程度の意思疎通ができます。共通の話題は天気の話や景色の話、それにコイバナなど。',
      'キャンプ：野外で夜を越すときは、キャンプをします。スマートテクスタイルを広げて雨風を避けるテントを作り、虫や鳥の鳴き声を聞きながら星空を眺めて一晩を過ごします。',
      'ミネラルウォーター：テラフォーミングした惑星の海は、元の惑星のミネラル組成によって成分がだいぶ違ってきます。それほどしょっぱくない海もあれば、赤や緑っぽい海もあり。生息する魚等もまったく違います。',
      'レイクサイド：クレーター等起伏のある地形に水が溜まってできた湖は、山裾の木々を鏡面のように反射して美麗な風景を作り出しています。中心部上層の澄んだ水は、簡単に浄化すれば飲み水にもできます。',
      '固有種：惑星に導入した動植物は、その惑星の環境に合わせて急速に独自の進化を遂げます。やたらにふわふわしたネコ科動物や雪の上に育つスノードロップ、転がって移動するアルマジロなどなど。',
      '枯れ草集め：都市部を離れると、エネルギー源はバイオ燃料に頼ることになります。地球以外の惑星には、基本的に石油や石炭など存在しません。燃料生成に使えそうな草木を集めましょう。',
      '山に進め：ジェットパックやスマートワイヤーがあるといっても、特に重力が強い惑星では高いところで大気が薄くなりやすく、山登りは大変なもの。しかしその分、山の上からの眺めは絶景です。',
      'スカイハイ・ビュー：自然の環境ですばやく移動するには、グライダーや翼を使って滑空するのが手っ取り早いです。高い木や丘に上ってからジェットパック併用で舞い上がれば、空からの美しい景観も楽しめます。',
      '道なき森の道：惑星を覆う森の中には、基本的に整備された道はありません。空を見上げれば陽の光を遮る樹の冠。草をかき分け、花や草いきれの臭いを感じながら、ときには木の上を通って、先に進みます。',
      'テラフォーミング：この銀河で、地球以外のすべての惑星はヒトが入植するために「テラフォーミング」したものです。水と大気を形成し、植物を育て、動物たちを導入し、長い年月を経て現在の姿になりました。'
    ]
    return get_table_by_1d10(table)
  end

  # 超未来の宇宙船内
  def get_sfinterior_table
    table = [
      '甲板上でお茶を：狭い宇宙船に飽きてきたら、甲板の上に出て無限に広がる宇宙を感じることもできます。気圧0なので圧力ポットで持ってくる必要がありますが、星空を眺めながら飲むお茶は乙なものです。',
      'マイクロマシン隔壁：宇宙船の隔壁はメタルナノカーボンやナノスチールでできていますが、補修のためにマイクロマシンが住んでいます。ときどき壁の端がちらちら動いて見えるのも、彼らのためかもしれません。',
      'ダンベル100kg持てる：惑星環境と比べれば、宇宙船の擬似重力はどうしても弱くなるもの。筋力の衰えを防ぐために、部屋にトレーニングマシンを生成して筋トレをします。適度な負荷をかけましょう。',
      'ユリカゴ：宇宙船に乗っている間は、多くの時間を宇宙船の居住スペース兼コントロールルームである「ユリカゴ」で過ごすことになります。たまにはホログラフィックで模様替えして気分を変えます。',
      '宇宙農法：数週間に渡る宇宙の旅では、食べ物や水は船内で育てます。マゼンダ色のLED ライトで植物やユーグレナを促成栽培し、バイオプラントでエネルギーゼリーを合成します。',
      'メンテナンス：宇宙船は数多くのパーツでできているため、どこかが不具合や故障を起こすこともあります。基本的に自動制御で管理できますが、自分の目と外接電脳でもチェックを入れてみましょう。',
      '重力のムラ：宇宙船は擬似重力発生装置を持っており、床に足が付きますが、場所によって「重力」にムラがあります。身体が重いと感じたら、部屋の隅に行けば軽くなるかもしれません。',
      'ワープ酔い：ワープ航法は空間の歪みを利用します。装甲が最も厚いユリカゴの中でも、ワープリングを出入りするときはグラっとくる感触があります。気分が悪くなったら、おとなしく寝ていましょう。',
      '1日25時間：宇宙船に「昼夜」はないため、照明を人工的に調整して生活サイクルを作ります。どうせ惑星ごとに1日の長さは違うので、24時間にこだわる必要はありません。自由に決めます。',
      'スターリー・スカイ：惑星の明かりも大気もない宇宙船の上からは、星空を鮮やかに見ることができます。当然、星によって天球図も違います。月が2つや4つあったり、連星が見られたりします。'
    ]
    return get_table_by_1d10(table)
  end
end
