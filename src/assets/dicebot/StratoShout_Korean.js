/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$setPrefixes', '$==', '$<=', '$>=', '$upcase', '$===', '$textFrom1D6Table', '$to_i', '$last_match', '$getSkillList', '$textFrom2D6Table', '$textFromD66Table', '$getD66', '$assoc', '$get_table_by_1d6', '$nil?', '$+', '$get_table_by_2d6', '$[]', '$-']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'StratoShout_Korean');

    var $nesting = [self].concat($parent_nesting), $StratoShout_Korean_initialize$1, $StratoShout_Korean_check_2D6$2, $StratoShout_Korean_rollDiceCommand$3, $StratoShout_Korean_textFromD66Table$4, $StratoShout_Korean_textFrom1D6Table$5, $StratoShout_Korean_textFrom2D6Table$6, $StratoShout_Korean_getSkillList$7;

    
    Opal.const_set($nesting[0], 'ID', "StratoShout:Korean");
    Opal.const_set($nesting[0], 'NAME', "스트라토 샤우트");
    Opal.const_set($nesting[0], 'SORT_KEY', "国際化:Korean:스트라토 샤우트");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "VOT, GUT, BAT, KEYT, DRT: (보컬, 기타, 베이스, 키보드, 드럼)트러블표\n" + "EMO: 감정표\n" + "AT[1-6]: 특기표(공백: 랜덤 1: 주의 2: 신체 3: 모티브 4: 이모션 5: 행동 6: 역경)\n" + "SCENE, MACHI, GAKKO, BAND: (범용, 거리, 학교, 밴드)장면표. 접근 장면에 사용\n" + "TENKAI: 장면 전개표. 분주 장면, 연습 장면에 사용\n" + "[]내는 생략가능　D66는 변동있음\n");
    self.$setPrefixes(["VOT", "GUT", "BAT", "KEYT", "DRT", "EMO", "AT[1-6]?", "SCENE", "MACHI", "GAKKO", "BAND", "TENKAI"]);
    
    Opal.def(self, '$initialize', $StratoShout_Korean_initialize$1 = function $$initialize() {
      var $iter = $StratoShout_Korean_initialize$1.$$p, $yield = $iter || nil, self = this, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) $StratoShout_Korean_initialize$1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', $StratoShout_Korean_initialize$1, false), $zuper, $iter);
      self.sendMode = 2;
      self.sortType = 1;
      return (self.d66Type = 2);
    }, $StratoShout_Korean_initialize$1.$$arity = 0);
    
    Opal.def(self, '$check_2D6', $StratoShout_Korean_check_2D6$2 = function $$check_2D6(total, dice_total, _dice_list, cmp_op, target) {
      var self = this;

      
      if (target['$==']("?")) {
        return ""};
      if (cmp_op['$=='](">=")) {
      } else {
        return ""
      };
      if ($truthy($rb_le(dice_total, 2))) {
        return " ＞ 펌블! (드라마페이즈: 【디스코드】+2 / 라이브페이즈: 【컨디션】-2)"
      } else if ($truthy($rb_ge(dice_total, 12))) {
        return " ＞ 스페셜! (【컨디션】+2)"
      } else if ($truthy($rb_ge(total, target))) {
        return " ＞ 성공"
      } else {
        return " ＞ 실패"
      };
    }, $StratoShout_Korean_check_2D6$2.$$arity = 5);
    
    Opal.def(self, '$rollDiceCommand', $StratoShout_Korean_rollDiceCommand$3 = function $$rollDiceCommand(command) {
      var self = this, $case = nil, title = nil, table = nil, value = nil;

      
      $case = command.$upcase();
      if ("VOT"['$===']($case)) {
      title = "보컬 트러블표(P167)";
      table = ["가사를 잊어버렸다! 어떤 말도 나오지 않아……", "마이크 코드에 발이 걸려버렸다! 위험해!", "마이크 스탠드가 쓰러져버렸다!", "음정이 어긋나고 있지만, 쉽게 고칠 수가 없어!", "리듬이 어긋나고 있는 것 같다……수정할 수 없어!", "목이 갈라질 것 같다. 위험해, 비축하지 않으면……!"];
      return self.$textFrom1D6Table(title, table);}
      else if ("GUT"['$===']($case)) {
      title = "기타 트러블표(P169)";
      table = ["위험해, 코드를 틀렸다! 어떻게든 무마시키자……", "겍, 실드(신호를 전달하는 코드)가 빠져버렸다! 소리가 안 나와!", "기타 소리에 노이즈가 낀 것 같은데……고쳐져라……!", "어라? 지금 곡의 어느 부분이더라……?", "현이 끊겨버렸다! 무슨 불길한…….", "피크가 날아가버렸다! 손가락으로 칠 수밖에 없어……!"];
      return self.$textFrom1D6Table(title, table);}
      else if ("BAT"['$===']($case)) {
      title = "베이스 트러블표(P171)";
      table = ["위험해, 코드를 틀렸다! 안 틀린 척 넘어가자……", "겍, 실드(신호를 전달하는 코드)가 뽑혔다! 소리가 안 나와!", "베이스 소리에 노이즈가 섞인 것 같은데……고쳐져라……!", "어라? 지금 어디 치고 있었더라……?", "손 끝의 감각이 둔해지기 시작했다. 안 움직여……!", "템포가 좀 빨라졌지만, 멈출 수 없어!"];
      return self.$textFrom1D6Table(title, table);}
      else if ("KEYT"['$===']($case)) {
      title = "키보드 트러블표(P173)";
      table = ["손 끝의 감각이 둔해지기 시작했다. 안 움직여……!", "실수로 볼륨 슬라이드를 건드렸다! 굉음이 나올거야!", "어라? 지금 어디 치고 있었지……?", "음이 안 나는 건반이 있어……고장!?", "음색 잘못 골랐다! 원래 음색 몇 번에 저장해뒀었지……!?", "건반 한 개를 잘못 짚었어……! 불협화음이다!"];
      return self.$textFrom1D6Table(title, table);}
      else if ("DRT"['$===']($case)) {
      title = "드럼 트러블표(P175)";
      table = ["팔이 꼬이기 시작했다! 다시 제대로 자릴 잡지 않으면……!", "어라? 지금 어디 치고 있었더라……?", "하이햇이 열리지 않아! 나사가 풀려있는 건가……!?", "애드립을 넣었는데, 다음 프레이즈가 기억나지 않는다……!", "템포가 점점 빨라지고 있지만, 멈출 수 없어!", "스틱이 날아갔다! 여분을 어디다 뒀더라……."];
      return self.$textFrom1D6Table(title, table);}
      else if ("EMO"['$===']($case)) {
      title = "감정표(P183)";
      table = ["공감/불신", "우정/질투", "호적수/짜증", "불가결/경원", "존경/열등감", "애정/부담감"];
      return self.$textFrom1D6Table(title, table);}
      else if (/^AT([1-6]?)$/['$===']($case)) {
      value = $$($nesting, 'Regexp').$last_match(1).$to_i();
      return self.$getSkillList(value);}
      else if ("SCENE"['$===']($case)) {
      title = "장면표(P199)";
      table = ["혼자만의 시간.문득 과거의 기억을 더듬어본다.그러고 보면 예전에 이런 일이 있었던 것 같은데…….", "어디선가 언쟁하는 듯한 소리가 들려온다. 싸우는 걸까?", "밤의 장막이 걷히고, 주변은 정적에 휩싸여 간다. 그녀석은 지금 뭘 하고있을까.", "동료와 함께 식사를 하고있자니, 화제는 자연스레 그 이야기로……", "웃음소리로 가득 찬 공간. 계속 이런 시간이 이어지면 좋을텐데.", "햇볕이 드는 장소. 바쁜 일상에서 잠시 빠져나와 평온한 시간이 흘러간다.", "스마트폰에서 착신 알람이 울린다. 전화? 메시지? 누구한테서 온 걸까.", "갑작스레 누군가가 당신을 찾아왔다. 뭔가 전할 것이 있는 모양이다.", "누군가가 잃어버린 물건을 발견했다. 전해주는 게 좋으려나.", "누군가 소문에 대한 이야기를 하고 있다. 들을 생각이 없어도 그것은 제멋대로 들려온다.", "어쩐지 오한이 인다. 좋지 않은 일이 일어날 것만 같은……"];
      return self.$textFrom2D6Table(title, table);}
      else if ("MACHI"['$===']($case)) {
      title = "거리 장면표(P199)";
      table = ["들어간 적 없는 곳에 처음으로 발을 내딛었다. 조금 긴장되네.", "아르바이트를 하는 곳. 함께 일하는 동료가 의외의 사실을 알려주었다.", "대화하는 것조차 어려울 정도로 큰 소리의 음악. 그 곳에 있는 것만으로도 기분이 고양된다.", "횡단보도에서 신호를 기다리고 있다보니 낯익은 인물의 모습을 발견했다.", "갑작스럽게 내리는 비에 당황해서 발걸음을 빨리 하는 사람들. 나도 빨리 돌아가야 하는데.", "무심코 들른 가게 안에서 아는 사람과 딱 마주쳤다. 이런 곳에서 뭘 하는 거야?", "연습을 끝내고 들른 음식점에서 의외의 인물을 발견. 잠시 그 모습을 지켜보자.", "여기저기서 어린 아이들의 신이 난 소목소리가 들려온다. 나도 저런 때가 있었을까?", "아무 소리도 없는 정적의 세계. 가끔은 소리를 멀리 하는 것도 좋겠지. ", "전차 안. 손잡이를 붙잡은 채 흔들리고 있다보니, 승객 중에서 낯익은 사람을 발견했다. ", "가라오케의 복도를 걷고 있다보면 어디선가 들어본 적 있는 목소리가……?"];
      return self.$textFrom2D6Table(title, table);}
      else if ("GAKKO"['$===']($case)) {
      title = "학교 장면표(P199)";
      table = ["교정 뒤에서 무언가에 대해 이야기하는 두 사람을 발견했다. 대체 무슨 얘기를 하고 있는 걸까……", "어느 동아리실, 부원들은 집중한 채 부활동에 힘쓰고 있는 것 같은데……", "선생님한테서 타겟에 대한 질문을 받았다. 뭔가 신경쓰이는 게 있는 모양이다.", "나뭇잎 사이로 아침햇살이 비쳐드는 등굣길. 어떤 사람은 바쁜 듯이, 또 어떤 사람은 즐거운 듯이 학교로 향하고 있다. ", "쉬는 시간. 교실 여기저기에 떠도는 시시한 소문들. 그 중에서 신경쓰이는 화제가 들려왔다.", "모든 것이 노을빛으로 물드는 해질녘. 학생들은 학업에서 해방되어 자유롭게 얼마 남지 않은 하루를 보내고 있다.", "이동수업용 교실로 향하는 구름다리에서 아래를 내려다보면, 낯익은 인물이 있다.", "점심 시간. 학생들은 제각각의 장소에서 점심 식사를 하고 있다. 자 그럼, 난 어디서 먹을까.", "선생님에게서 심부름을 부탁받아 떠맡고 말았다. 얼른 해치워버리자. ", "슬슬 학교의 문이 닫힐 시간이다. 불이 들어와 있는 교실은 이제 거의 없다", "스피커에서 교내방송이 들려온다. 누군가를 부르고 있는 것 같은데……?"];
      return self.$textFrom2D6Table(title, table);}
      else if ("BAND"['$===']($case)) {
      title = "밴드 장면표(P199)";
      table = ["음악 전문 인터넷 뉴스 사이트를 체크. 크고 작은 기사가 투고되어 있다.", "의외의 장소에서 연습하고 있는 인물을 발견. 살짝 말을 걸어볼까.", "사소한 벽에 부딪쳤다. 누군가한테 상담하는 게 좋을지도……", "라이브를 보기 위해 라이브 하우스에 찾아왔다. 어떤 스테이지가 되려나.", "멤버들과 만나기로 한 라이브하우스. 도착해 있는 건 우리들만이 아닌 것 같다", "연습이 끝난 후 돌아가는 길. 그녀석도 지금쯤 연습이 끝났으려나.", "어디선가 악기 소리가 들려온다. 누가 연주하고 있는 걸까.", "열기로 가득한 방에서 나와 스튜디오의 대합실에서 쿨 다운. 소파에 앉아있는 건……", "악기점에 방문했다가 낯익은 인물을 발견. 뭘 하러 온 걸까.", "최신 히트곡이 흐르고 있는 CD가게 안. 다음 곡은 어떤 걸로 할까……", "무심코 울린 소리에서 즉흥 세션으로 발전. 가볍게 실력을 보여줄까."];
      return self.$textFrom2D6Table(title, table);}
      else if ("TENKAI"['$===']($case)) {
      title = "장면 전개표(P201)";
      table = [[11, "절망 : 절차를 역으로 크게 하거나 혹은, 장면 플레이어를 파멸로 몰아넣는 상황에 빠져듭니다.【디스코드】+2점"], [12, "붕괴 : 절차에 의해 장면 플레이어의 소중한 것이 붕괴되거나 혹은, 붕괴 직전에 몰립니다.【디스코드】+2점"], [13, "단절 : 장면 플레이어는 절차에 의해 무언가와 절연 상태가 됩니다.【디스코드】+2점"], [14, "공포 : 절차에 공포를 느낄만한 일과 조우합니다.【디스코드】+2점"], [15, "오해 : 장면 플레이어가 절차에 관련된 어떤 오해를 받습니다.【디스코드】+2점"], [16, "시련 : 장면 플레이어는 절차에 관련된 시련에 직면합니다.【디스코드】+2점"], [22, "악의 : 장면 플레이어의 마음에 순간적으로 나쁜 마음이 깃들어, 절차를 불합리하게 해결하려 합니다.【디스코드】+1점"], [23, "속박 : 절차에 관련된 무언가에 속박되어, 자유로운 행동이 불가능해집니다.【디스코드】+1점"], [24, "흉조 : 절차에 대해 나쁜 일이 일어날 것만 같은 조짐이 찾아옵니다.【디스코드】+1점"], [25, "가속 : 장면 플레이어는 절차의 해결에 쫓깁니다.【디스코드】+1점"], [26, "일상 : 장면 플레이어는 한가로운 일상을 보냅니다.【컨디션】+1점"], [33, "휴식 : 절차를 잊어버릴만큼 평온한 한 때를 보냅니다.【컨디션】+1점"], [34, "길조 : 절차에 대해 좋은 일이 일어날 것 같은 조짐이 찾아옵니다.【컨디션】+1점"], [35, "발견 : 장면 플레이어는 절차에 대한 무언가를 발견합니다.【컨디션】+1점"], [36, "희망 : 장면 플레이어의 마음 속에 절차에 대해 긍정적으로 맞설 의사가 생겨납니다.【컨디션】+1점"], [44, "성장 : 절차를 통해 장면 플레이어가 성장합니다.【컨디션】+2점"], [45, "애정 : 절차를 통해 장면 플레이어가 애정에 닿게 됩니다.【컨디션】+2점"], [46, "낭보 : 절차에 대한 좋은 소식이 날아들어옵니다.【컨디션】+2점"], [55, "호전 : 절차가 좋은 방향으로 향할 것 같은 사건이 일어납니다.【컨디션】+3점"], [56, "직감 : 절차를 해결할 수 있는 결정적인 번뜩임을 얻습니다.【컨디션】+3점"], [66, "기적 : 절차에 관한 기적적인 행운이 찾아옵니다.【컨디션】+3점"]];
      return self.$textFromD66Table(title, table);};
      return nil;
    }, $StratoShout_Korean_rollDiceCommand$3.$$arity = 1);
    
    Opal.def(self, '$textFromD66Table', $StratoShout_Korean_textFromD66Table$4 = function $$textFromD66Table(title, table) {
      var $a, $b, self = this, isSwap = nil, dice = nil, number = nil, text = nil;

      
      isSwap = true;
      dice = self.$getD66(isSwap);
      $b = table.$assoc(dice), $a = Opal.to_ary($b), (number = ($a[0] == null ? nil : $a[0])), (text = ($a[1] == null ? nil : $a[1])), $b;
      return "" + (title) + " ＞ [" + (number) + "] ＞ " + (text);
    }, $StratoShout_Korean_textFromD66Table$4.$$arity = 2);
    
    Opal.def(self, '$textFrom1D6Table', $StratoShout_Korean_textFrom1D6Table$5 = function $$textFrom1D6Table(title, table1, table2) {
      var $a, $b, self = this, text1 = nil, number1 = nil, text = nil, text2 = nil, number2 = nil;

      
      
      if (table2 == null) {
        table2 = nil;
      };
      $b = self.$get_table_by_1d6(table1), $a = Opal.to_ary($b), (text1 = ($a[0] == null ? nil : $a[0])), (number1 = ($a[1] == null ? nil : $a[1])), $b;
      text = "" + (title) + " ＞ ";
      if ($truthy(table2['$nil?']())) {
        text = $rb_plus(text, "" + "[" + (number1) + "] ＞ " + (text1))
      } else {
        
        $b = self.$get_table_by_1d6(table2), $a = Opal.to_ary($b), (text2 = ($a[0] == null ? nil : $a[0])), (number2 = ($a[1] == null ? nil : $a[1])), $b;
        text = $rb_plus(text, "" + "[" + (number1) + "," + (number2) + "] ＞ " + (text1) + (text2));
      };
      return text;
    }, $StratoShout_Korean_textFrom1D6Table$5.$$arity = -3);
    
    Opal.def(self, '$textFrom2D6Table', $StratoShout_Korean_textFrom2D6Table$6 = function $$textFrom2D6Table(title, table) {
      var $a, $b, self = this, text = nil, number = nil;

      
      $b = self.$get_table_by_2d6(table), $a = Opal.to_ary($b), (text = ($a[0] == null ? nil : $a[0])), (number = ($a[1] == null ? nil : $a[1])), $b;
      return "" + (title) + " ＞ [" + (number) + "] ＞ " + (text);
    }, $StratoShout_Korean_textFrom2D6Table$6.$$arity = 2);
    return (Opal.def(self, '$getSkillList', $StratoShout_Korean_getSkillList$7 = function $$getSkillList(field) {
      var $a, $b, self = this, title = nil, table = nil, number1 = nil, fieldName = nil, skill = nil, number2 = nil, text = nil;

      
      
      if (field == null) {
        field = 0;
      };
      title = "특기 리스트";
      table = [["주의", ["과거", "연인", "동료", "가족", "자신", "지금", "이유", "꿈", "세계", "행복", "미래"]], ["신체", ["머리", "눈", "귀", "입", "가슴", "심장", "피", "등", "손", "XXX", "발"]], ["모티브", ["어둠", "무기", "짐승", "기계", "거리", "노래", "창", "꽃", "하늘", "계절", "빛"]], ["정서", ["슬픔", "분노", "불안", "공포", "놀라움", "설렘", "정열", "확신", "기대", "즐거움", "기쁨"]], ["행동", ["우는", "잊는", "지우는", "부수는", "외치는", "노래하는", "춤추는", "달리는", "만나는", "부르는", "웃는"]], ["역경", ["죽음", "상실", "폭력", "고독", "후회", "실력", "싫증", "본성", "부", "연애", "삶"]]];
      number1 = 0;
      if (field['$=='](0)) {
        $b = self.$get_table_by_1d6(table), $a = Opal.to_ary($b), (table = ($a[0] == null ? nil : $a[0])), (number1 = ($a[1] == null ? nil : $a[1])), $b
      } else {
        table = table['$[]']($rb_minus(field, 1))
      };
      $b = table, $a = Opal.to_ary($b), (fieldName = ($a[0] == null ? nil : $a[0])), (table = ($a[1] == null ? nil : $a[1])), $b;
      $b = self.$get_table_by_2d6(table), $a = Opal.to_ary($b), (skill = ($a[0] == null ? nil : $a[0])), (number2 = ($a[1] == null ? nil : $a[1])), $b;
      text = title;
      if (field['$=='](0)) {
        text = $rb_plus(text, "" + " ＞ [" + (number1) + "," + (number2) + "]")
      } else {
        text = $rb_plus(text, "" + "(" + (fieldName) + "분야) ＞ [" + (number2) + "]")
      };
      return "" + (text) + " ＞ 《" + (skill) + "／" + (fieldName) + (number2) + "》";
    }, $StratoShout_Korean_getSkillList$7.$$arity = -1), nil) && 'getSkillList';
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting)
})(Opal);
