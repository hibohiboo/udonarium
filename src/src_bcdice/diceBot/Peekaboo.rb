# -*- coding: utf-8 -*-

class Peekaboo < DiceBot
  setPrefixes(['SET', 'PSET', 'OET', 'IBT', 'SBT', 'NET'])

  def initialize
    super
    @sendMode = 2
    @sortType = 1
    @d66Type = 2
    @fractionType = "roundUp"     # 端数切り上げに設定
  end
  def gameName
    'ピーカーブー'
  end

  def gameType
    "Peekaboo"
  end

  def getHelpMessage
    return <<INFO_MESSAGE_TEXT
・判定
　判定時にクリティカルとファンブルを自動判定します。
・各種表
　・学校イベント表　　　　　　　　SET
　・個別学校イベント表　　　　　　PSET
　・オバケ屋敷イベント表　　　　　OET
　・イノセント用バタンキュー！表　IBT
　・スプーキー用バタンキュー！表　SBT
　・日中ブラブラ表                NET
・D66ダイスあり
INFO_MESSAGE_TEXT
  end

  # ゲーム別成功度判定(2D6)
  def check_2D6(total_n, dice_n, signOfInequality, diff, dice_cnt, dice_max, n1, n_max)
    return '' unless(signOfInequality == ">=")

    if(dice_n <= 2)
      return " ＞ ファンブル(【眠気】が1d6点上昇)"
    elsif(dice_n >= 12)
      return " ＞ スペシャル(【魔力】あるいは【眠気】が1d6点回復)"
    elsif(total_n >= diff)
      return " ＞ 成功"
    else
      return " ＞ 失敗"
    end
  end

  def rollDiceCommand(command)
    output = '1'

    case command
    when /((\w)+ET)/i       # イベント表
      head = $1.upcase
      debug("head", head)
      output = pk_event_table( head )
    when /((\w)+BT)/i    # バタンキュー表
      head = $1.upcase
      output = pk_batankyu_table( head )
    end

    return output
  end

  #  イベント表
  def pk_event_table(string)
    output = '1'
    type = ""

    case string
    when /PSET/i
      type = '個別学校'
      output, total_n = pk_private_school_event_table
    when /SET/i
      type = '学校'
      output, total_n = pk_school_event_table
    when /OET/i
      type = 'お化け屋敷'
      output, total_n = pk_obakeyashiki_event_table
    when /NET/i
      type = '日中ブラブラ'
      output, total_n = pk_nittyu_event_table
    end

    debug("output", output)
    debug("total_n", total_n)

    output = "#{type}イベント表(#{total_n}) ＞ #{output}"
    return output
  end

  #  学校イベント表
  def pk_school_event_table
    table = [
             '持ち物検査が行われる！　イノセント全員は、《隠れる/不良9》の判定を行うこと。失敗したキャラクターは、GMがアイテム1個を選んで没収することができる（セッション終了時に返してもらえる）' ,
             'クラスで流行っている遊びに誘われる。GMは、「遊び」の分野の中からランダムに特技一つを選ぶ。イノセント全員は、その判定を行う。失敗したキャラクターは、【眠気】が1d6点増える。' ,
             'とても退屈な授業が始まった。イノセント全員は、《いねむり/不良3》の判定を行う。失敗したキャラクターは、【眠気】が1d6+1点増える。' ,
             '明日までの宿題を出される。イノセント全員は、明日までに宿題を終わらせないといけない。宿題をやるためには、《宿題/勉強7》の判定に成功しなければならない。宿題を次の日の学校フェイズまでに終わらせることができなかった場合は居残り勉強させられる。その日の放課後フェイズの最初のサイクルは、1回休み。' ,
             '今日も今日とて楽しい授業。GMは、「勉強」の分野の中からランダムに特技1つを選ぶ。イノセント全員は、その判定を行う。失敗したキャラクターは【眠気】が1d6点増える。' ,
             '特に変わったこともなく、おだやかな一日だった。イノセント全員は、【眠気】が1点増える。' ,
             '今日の体育の時間はハードだった！　GMは、「運動」の分野の中からランダムに特技1つを選ぶ。イノセント全員は、その判定を行う。失敗したキャラクターは、【眠気】が1d6点増える。' ,
             '自習の時間だ！　GMは、「勉強」の分野の中からランダムに特技1つを選ぶ。イノセント全員は、その判定を行う。成功したキャラクターは、1回だけ自由行動ができる。' ,
             '抜き打ちテストだ！　GMは、「勉強」の分野の中からランダムに特技1つを選ぶ。イノセント全員は、-2の修正をつけて、その特技の判定を行う。成功したキャラクターはよい点をゲット！家にかえってそれを親に見せるとおこづかいを1個もらえる。失敗したキャラクターは、親にこっぴどく怒られ、【眠気】が1d6点増えるうえに、それ以降「みんなで遊ぶ」ことが出来なくなる。' ,
             '体操服や水着、宿題に提出物などなど、今日は学校に持ってこないといけないものがあったはず！《計画性/大人7》で判定を行う。失敗すると、先生に怒られてしょんぼり。【眠気】が1d6点増える。' ,
             'それぞれに色々なことがあった。イノセントは、各自1回ずつ2d6を振り、個別学校イベント表の指示に従うこと。' ,
            ]

    return get_table_by_2d6(table)
  end

  #  個別学校イベント表
  def pk_private_school_event_table
    table = [
             'クラスの中に気になるコが現れる。《恋愛/大人11》の判定を行う。成功すると、その子と仲良くなって経験値を1点獲得する。' ,
             'お腹の調子が悪くなり、トイレに行きたくなる。《がまん/友達5》か《隠れる/不良9》の判定を行うこと。失敗すると、不名誉なあだ名をつけられ、それ以降、「友達」の分野の判定に-1の修正を受ける。' ,
             '今日の給食には、どうしても苦手な食べ物が出てきた。《勇気/友達9》で判定を行うこと。成功すると、苦手な食べ物を克服し、気分爽快！【眠気】を1d6点回復するか、【元気】を1点回復することができる。' ,
             '友達から遊ぼうと誘われる。その日の放課後フェイズに、クラスメイト1d6人と「みんなで遊ぶ」ことができる。これを断る場合は、《優しさ/友達4》で判定を行うこと。失敗するとこれ以降、「みんなで遊ぶ」を行うとき、友達を誘うことが出来なくなる。' ,
             '今日はクラブ活動があった。次のサイクルは行動できなくなる。その代わり、好きな特技1つを選ぶ。このセッションの間、その特技の判定を行うとき+1の修正がつく。' ,
             '授業中、先生がとても難しい問題を出してくる。GMは、「勉強」の分野からランダムに特技を1つ選ぶ。その判定を行うこと。成功すると、経験値を1点獲得する。' ,
             'クラスでオバケの噂を耳にする。《うわさ話/友達3》の判定に成功すると、GMからそのセッションで出てくるオバケの外見や情報を教えてもらうことができる。' ,
             '校庭や体育館など、自分達の遊び場が他のグループに占拠されている。《けんか/不良12》で判定を行うこと。成功すると、それ以降「友達」の分野の判定に+1の修正を受ける。失敗すると遊び場を失ってしまう。1ダメージを受け、それ以降、「友達と遊ぶ」ことができなくなってしまう。' ,
             'いじめの現場に出くわす！　《勇気/友達10》の判定に成功すると、いじめっこを撃退することができる。いじめられていた子が、お礼にお菓子を1個くれる。失敗すると1点のダメージを受ける。' ,
             '今日は全校集会があった。《がまん/友達5》で判定を行う。失敗すると貧血で倒れ次のサイクルは行動できなくなる。' ,
             '図書室で面白そうな本を発見する。《読書/遊び8》で判定を行うこと。成功すると、経験値を1点獲得する。' ,
            ]

    return get_table_by_2d6(table)
  end

  #  お化け屋敷イベント表
  def pk_obakeyashiki_event_table
    table = [
             '謎かけ守護者が門を護っている。未行動のキャラクターは、《クイズ/遊び10》の判定を行うことができる。判定したキャラクターは行動済みになる。失敗したキャラクターは、1点のダメージを受ける。誰かが成功すれば、イベントはクリアできる。' ,
             '天井から血の雨が降ってくる！　この雨に触れると火傷しちゃうみたいだ！【防御力】が0のスプーキーとイノセントは、《かけっこ/運動7》の判定を行う。失敗すると、イノセントは1ダメージ、スプーキーは1d6ダメージを受ける。成功・失敗にかかわらず、イベントはクリアできる。' ,
             'トンガリ族の妖精がいる。彼は、先へ行くための通行料として、アイテムを要求してくる。何か好きなアイテム1個を渡すか、未行動のキャラクターは、《お話づくり/遊び9》の判定を行うことができる。判定したキャラクターは行動済みになる。誰かが判定に成功するか、アイテムを渡すかしたら、イベントはクリアできる。' ,
             '行き止まりだ。先に進む方法が分からない。未行動のキャラクターは、《推理/大人6》の判定を行うことができる。判定したキャラクターは行動済みになる。誰かが成功したら、イベントはクリアできる。' ,
             'まっくらで、何も見えない部屋だ。一行は不安におちいる。未行動のキャラクターは、《仕切る/友達11》の判定を行うことができる。判定したキャラクターは行動済みになる。誰かが成功すれば、イベントはクリアできる。' ,
             'ジメジメした通路だ。特に何もしなくても、イベントはクリアだ。誰かがのぞむなら、自由行動を1回行うことができるぞ。' ,
             '通路が途中で途切れて崖のようになっている。誰かが飛ぶことが出来れば、向こう岸にあるはしごを断崖にかけられそうだけど……。未行動のキャラクターは、《とぶ/運動6》の判定を行うことができる。判定したキャラクターは行動済みになる。誰かが成功すれば、イベントはクリアできる。' ,
             'まぼろしの部屋だ。各キャラクターの大好物のまぼろしがつぎつぎ現れる。未行動のキャラクターは、《がまん/友達5》の判定を行うことができる。判定したキャラクターは行動済みになる。誰かが成功したら、イベントはクリアできる。' ,
             '通路がいくつにも分岐している……。未行動のキャラクターのうち1人が《地理/勉強11》、もしくは《絵/遊び5》の判定を行う。判定したキャラクターは行動済みになる。失敗すると、そのオバケ屋敷の部屋数が1d6点上昇する。成功失敗にかかわらず、イベントはクリアできる。' ,
             'シャドウが見回りをしている。未行動のキャラクターのうち1人が、《隠れる/不良9》の判定を行う。成功すれば、イベントはクリアできる。失敗すると、プレイヤーと同じ人数のシャドウと戦闘を行うこと。勝利すればイベントはクリアできる。' ,
             '足下からシャドウが現れ、みんなに襲いかかる！　プレイヤーと同じ人数のシャドウと戦闘を行うこと。勝利すればイベントはクリアできる。' ,
            ]

    return get_table_by_2d6(table)
  end

  #  日中ブラブラ表
  def pk_nittyu_event_table
    table = [
             '相棒のスプーキーと喧嘩する。1ｄ6サイクルの間、自分の相棒のスプーキーは、自分に対して【お助け力】を使用することができなくなる。' ,
             'ついついネットやゲームで時間をつぶす。特に何もなし。。' ,
             '街をブラブラしていたら、突然シッポ族のオバケに襲われる。「お前、大人のくせに俺が見えるのか？」GMは「運動」の分野の中から、ランダムに特技を1つ選ぶ。この表の使用者は、その判定を行う。成功したら、オバケに気に入られ、セッション中、好きな時に一度だけ、シッポ族の魔法をかけてもらうことができるようになる。失敗すると1点のダメージを受ける。' ,
             '…暇だ。たまには、タメになりそうな本でも読んでみるか。GMは「勉強」の分野の中から、ランダムに特技1つを選ぶ。この表の使用者はその判定を行う。成功したら、セッション中、好きな時に一度だけ、判定を自動的に成功することができるようになる。失敗すると退屈のあまり【眠気】が1ｄ6点上昇する。' ,
             'ああ、まずい。会いたくないヤツに会っちまったなぁ。どうやって誤魔化そう？GMは「不良」の分野の中から、ランダムに特技1つを選ぶ。この表の使用者は、その判定を行う。成功したら、うまく誤魔化してそのシナリオに登場するハグレオバケの噂を手に入れることができる。失敗するとお説教をくらって【眠気】が1ｄ6点上昇する。' ,
             'ふわわわわ。眠いなぁ。……寝るか。【眠気】を2ｄ6点回復する。' ,
             'うーん。腹減った。何か食べたいけど……。GMは「大人」の分野の中から、ランダムに特技を1つ選ぶ。この表の使用者はその判定を行う。成功したら、【お菓子】を1ｄ6個手に入れる。失敗すると、持っていれば【おこづかい】を一個減らす。' ,
             'うーん。そうだ。あいつに連絡してみるか……。GMは「友達」分野の中からランダムに特技1つを選ぶ。この表の使用者は、その判定を行う。成功したら友達の力を借りて、それ以降の自分の手番に二回行動することができるようになる。失敗すると、誰にも捕まらず、寂しさのあまり【眠気】が1ｄ6点上昇する。' ,
             '臨時のバイト。久々の労働だ。GMは「遊び」の分野の中から、ランダムに特技を1つ選ぶ。この表の使用者は、その判定を行う。成功したら、【おこづかい】を1つ獲得できる。失敗すると【眠気】が1ｄ6点上昇する。' ,
             'あ、これ欲しかったんだよな。つい無駄な買い物をしてしまう。持っていれば【おこづかい】を一個減らす。' ,
             '相棒のスプーキーと、素敵な時間を過ごす。そのセッションの間だけ、「武装契約」「守護契約」「強化契約」「同調契約」のいずれか一つを結ぶことができる。' ,
            ]

    return get_table_by_2d6(table)
  end

  #  バタンキュー表
  def pk_batankyu_table( string )
    output = '1'
    type = ""

    case string
    when /IBT/i
      type = 'イノセント用'
      output, total_n = pk_innocent_batankyu_table
    when /SBT/i
      type = 'スプーキー用'
      output, total_n = pk_spooky_batankyu_table
    end

    output = "#{type}バタンキュー！表(#{total_n}) ＞ #{output}"
    return output
  end

  #  イノセント用バタンキュー！表
  def pk_innocent_batankyu_table
    table = [
             '悲しい別れ。病院につれていくことができれば、1d6日入院したあとに目覚めます。その間は、行動不能です。目覚めたときに【眠気】も【元気】もすべて回復しますが、スプーキーを見ることができなくなっています。そのキャラクターはスプーキーと一緒に冒険を続けることはできません……。' ,
             '大けがをして昏睡状態。病院につれていくことができれば、1d6日入院したあとに目覚めます。その間は、行動不能です。目覚めたときに【眠気】はすべて回復し、【元気】が3点回復します。' ,
             '気絶しちゃった！　1d6サイクル後に目覚めます。気絶している間は、行動不能です。目覚めたときに【眠気】が1d6点、【元気】が1点回復します。' ,
             '体が動かない！　何かを見たり、話したりといった簡単な行動ならできますが、自由行動や戦闘行動といった通常の行動は行えません。1d6サイクル後に【元気】が1点回復し、通常通り行動できるようになります。' ,
             'かろうじて意識はあるものの、朦朧としてきた。【眠気】が2d6点増えます。それで行動不能になっていなければ、【元気】が1点回復します。そうでなければ、気絶してしまい、1d6サイクル後に目覚めます。気絶している間は、行動不能です。目覚めたときに【眠気】が1d6点減少し、【元気】が1点回復します。' ,
             'なんという幸運！　アイテムがキミを護ってくれた。もし持ち物にアイテムがあった場合、それが1個破壊され、受けたダメージを無効化します。アイテムがなければ行動不能になります。' ,
            ]

    return get_table_by_1d6(table)
  end

  #  スプーキー用バタンキュー！表
  def pk_spooky_batankyu_table
    table = [
             '封印状態！　オバケは封印されてしまいます。1d6*1年後になれば、そのオバケは復活します。それまでは、イノセントと一緒に冒険することはできません。できたとしても、そのときイノセントはあなたを見ることができなくなっているかもしれませんが……。' ,
             '休眠状態！　オバケは休眠状態になります。1d6日が経過すると目覚めます。その間は、行動不能です。目覚めたときに【魔力】はすべて回復しています。' ,
             'コバケ状態！　体は小さく縮んてしまい、重戦闘も戦闘行動も行うことはできません。【魔力】が1点以上になると、通常通り行動できるようになります。' ,
             '混沌変化！　自分のリングのからだリストを使って、ランダムにからだを1つ選びます。自分のからだが、それに変化します。1d6サイクルの間、行動不能になります。その後、【魔力】が1d6点回復して通常通り行動できるようになります。' ,
             '魔力変質！　自分のリングの衣装リストを使って、ランダムに衣装を1つ選びます。自分の衣装1つが、それに変化します。そして、1d6サイクルの間、行動不能になります。その後、【魔力】が1d6点回復して通常通り行動できるようになります。' ,
             '魔法暴発！　自分の持っている魔法をランダムに1つ選んで、その効果が発動します。魔法の対象が選べる場合は、スプーキーのプレイヤーが選んで構いません。そして、1d6サイクルの間、行動不能になります。その後、【魔力】が1d6点回復して通常通り行動できるようになります。' ,
            ]

    return get_table_by_1d6(table)
  end
end
