/* Generated by Opal 0.11.4 */
(function(Opal) {
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  function $rb_divide(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
  }
  function $rb_times(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy, $gvars = Opal.gvars;

  Opal.add_stubs(['$setPrefixes', '$debug', '$checkRoll', '$empty?', '$checkJudgeValue', '$rollTableCommand', '$=~', '$to_i', '$nil?', '$getRollResult', '$+', '$getSuccess', '$getCheckFlagResult', '$==', '$times', '$roll', '$[]=', '$join', '$sort', '$!=', '$reverse', '$[]', '$>=', '$>', '$getDownWill', '$getModifyText', '$getTotalResultValue', '$===', '$-', '$getTotalResultValueWhenSlash', '$ceil', '$/', '$*', '$upcase', '$choiceStrengthStigmaTable', '$choiceWillStigmaTable', '$choiceStrengthBadEndTable', '$choiceWillBadEndTable', '$get_table_by_2d6']);
  return (function($base, $super, $parent_nesting) {
    function $DetatokoSaga_Korean(){};
    var self = $DetatokoSaga_Korean = $klass($base, $super, 'DetatokoSaga_Korean', $DetatokoSaga_Korean);

    var def = self.$$proto, $nesting = [self].concat($parent_nesting), TMP_DetatokoSaga_Korean_initialize_1, TMP_DetatokoSaga_Korean_gameName_2, TMP_DetatokoSaga_Korean_gameType_3, TMP_DetatokoSaga_Korean_getHelpMessage_4, TMP_DetatokoSaga_Korean_rollDiceCommand_5, TMP_DetatokoSaga_Korean_checkRoll_6, TMP_DetatokoSaga_Korean_getRollResult_8, TMP_DetatokoSaga_Korean_getSuccess_9, TMP_DetatokoSaga_Korean_getCheckFlagResult_10, TMP_DetatokoSaga_Korean_getDownWill_11, TMP_DetatokoSaga_Korean_checkJudgeValue_12, TMP_DetatokoSaga_Korean_getModifyText_13, TMP_DetatokoSaga_Korean_getTotalResultValue_14, TMP_DetatokoSaga_Korean_getTotalResultValueWhenSlash_15, TMP_DetatokoSaga_Korean_rollTableCommand_16, TMP_DetatokoSaga_Korean_choiceStrengthStigmaTable_17, TMP_DetatokoSaga_Korean_choiceWillStigmaTable_18, TMP_DetatokoSaga_Korean_choiceStrengthBadEndTable_19, TMP_DetatokoSaga_Korean_choiceWillBadEndTable_20;

    
    self.$setPrefixes(["\\d+DS.*", "\\d+JD.*", "SST", "StrengthStigmaTable", "WST", "WillStigmaTable", "SBET", "StrengthBadEndTable", "WBET", "WillBadEndTable"]);
    
    Opal.defn(self, '$initialize', TMP_DetatokoSaga_Korean_initialize_1 = function $$initialize() {
      var self = this, $iter = TMP_DetatokoSaga_Korean_initialize_1.$$p, $yield = $iter || nil, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) TMP_DetatokoSaga_Korean_initialize_1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', TMP_DetatokoSaga_Korean_initialize_1, false), $zuper, $iter);
      self.sendMode = 2;
      self.sortType = 1;
      return (self.d66Type = 2);
    }, TMP_DetatokoSaga_Korean_initialize_1.$$arity = 0);
    
    Opal.defn(self, '$gameName', TMP_DetatokoSaga_Korean_gameName_2 = function $$gameName() {
      var self = this;

      return "데타토코 사가"
    }, TMP_DetatokoSaga_Korean_gameName_2.$$arity = 0);
    
    Opal.defn(self, '$gameType', TMP_DetatokoSaga_Korean_gameType_3 = function $$gameType() {
      var self = this;

      return "DetatokoSaga:Korean"
    }, TMP_DetatokoSaga_Korean_gameType_3.$$arity = 0);
    
    Opal.defn(self, '$getHelpMessage', TMP_DetatokoSaga_Korean_getHelpMessage_4 = function $$getHelpMessage() {
      var self = this, info = nil;

      return (info = "" + "・통상판정　xDS or xDSy or xDS>=z or xDSy>=z\n" + "　(x＝스킬레벨, y＝현재 플래그(생략=0), z＝목표치(생략=８))\n" + "　예）3DS　2DS5　0DS　3DS>=10　3DS7>=12\n" + "・판정치　xJD or xJDy or xJDy+z or xJDy-z or xJDy/z\n" + "　(x＝스킬레벨, y＝현재 플래그(생략=0), z＝수정치(생략=０))\n" + "　예）3JD　2JD5　3JD7+1　4JD/3\n" + "・체력 낙인표　SST (StrengthStigmaTable)\n" + "・기력 낙인표　WST (WillStigmaTable)\n" + "・체력 배드엔딩표　SBET (StrengthBadEndTable)\n" + "・기력 배드엔딩표　WBET (WillBadEndTable)\n")
    }, TMP_DetatokoSaga_Korean_getHelpMessage_4.$$arity = 0);
    
    Opal.defn(self, '$rollDiceCommand', TMP_DetatokoSaga_Korean_rollDiceCommand_5 = function $$rollDiceCommand(command) {
      var self = this, result = nil;

      
      self.$debug("rollDiceCommand begin string", command);
      result = "";
      result = self.$checkRoll(command);
      if ($truthy(result['$empty?']())) {
        } else {
        return result
      };
      result = self.$checkJudgeValue(command);
      if ($truthy(result['$empty?']())) {
        } else {
        return result
      };
      self.$debug("각종표로서 처리");
      return self.$rollTableCommand(command);
    }, TMP_DetatokoSaga_Korean_rollDiceCommand_5.$$arity = 1);
    
    Opal.defn(self, '$checkRoll', TMP_DetatokoSaga_Korean_checkRoll_6 = function $$checkRoll(string) {
      var $a, $b, self = this, target = nil, skill = nil, flag = nil, result = nil, total = nil, rollText = nil, success = nil;

      
      self.$debug("checkRoll begin string", string);
      if ($truthy(/^(\d+)DS(\d+)?((>=)(\d+))?$/i['$=~'](string))) {
        } else {
        return ""
      };
      target = 8;
      skill = (($a = $gvars['~']) === nil ? nil : $a['$[]'](1)).$to_i();
      flag = (($a = $gvars['~']) === nil ? nil : $a['$[]'](2)).$to_i();
      if ($truthy((($a = $gvars['~']) === nil ? nil : $a['$[]'](5))['$nil?']())) {
        } else {
        target = (($a = $gvars['~']) === nil ? nil : $a['$[]'](5)).$to_i()
      };
      result = "" + "판정！　스킬레벨：" + (skill) + "　플래그：" + (flag) + "　목표치：" + (target);
      $b = self.$getRollResult(skill), $a = Opal.to_ary($b), (total = ($a[0] == null ? nil : $a[0])), (rollText = ($a[1] == null ? nil : $a[1])), $b;
      result = $rb_plus(result, "" + " ＞ " + (total) + "[" + (rollText) + "] ＞ 판정치：" + (total));
      success = self.$getSuccess(total, target);
      result = $rb_plus(result, "" + " ＞ " + (success));
      result = $rb_plus(result, self.$getCheckFlagResult(total, flag));
      return result;
    }, TMP_DetatokoSaga_Korean_checkRoll_6.$$arity = 1);
    
    Opal.defn(self, '$getRollResult', TMP_DetatokoSaga_Korean_getRollResult_8 = function $$getRollResult(skill) {
      var TMP_7, self = this, diceCount = nil, dice = nil, diceText = nil, total = nil;

      
      diceCount = $rb_plus(skill, 1);
      if (skill['$=='](0)) {
        diceCount = 3};
      dice = [];
      $send(diceCount, 'times', [], (TMP_7 = function(i){var self = TMP_7.$$s || this, $a, $b;
if (i == null) i = nil;
      return $b = self.$roll(1, 6), $a = Opal.to_ary($b), dice['$[]='](i, ($a[0] == null ? nil : $a[0])), $b}, TMP_7.$$s = self, TMP_7.$$arity = 1, TMP_7));
      diceText = dice.$join(",");
      dice = dice.$sort();
      if ($truthy(skill['$!='](0))) {
        dice = dice.$reverse()};
      total = $rb_plus(dice['$[]'](0), dice['$[]'](1));
      return [total, diceText];
    }, TMP_DetatokoSaga_Korean_getRollResult_8.$$arity = 1);
    
    Opal.defn(self, '$getSuccess', TMP_DetatokoSaga_Korean_getSuccess_9 = function $$getSuccess(check, target) {
      var self = this;

      
      if ($truthy($rb_ge(check, target))) {
        return "목표치 이상！【성공】"};
      return "목표치 미달… 【실패】";
    }, TMP_DetatokoSaga_Korean_getSuccess_9.$$arity = 2);
    
    Opal.defn(self, '$getCheckFlagResult', TMP_DetatokoSaga_Korean_getCheckFlagResult_10 = function $$getCheckFlagResult(total, flag) {
      var self = this, willText = nil, result = nil;

      
      if ($truthy($rb_gt(total, flag))) {
        return ""};
      willText = self.$getDownWill(flag);
      result = "" + ", 플래그 이하！ 【기력" + (willText) + "점 감소】";
      result = $rb_plus(result, " 【판정치 변경 불가】");
      return result;
    }, TMP_DetatokoSaga_Korean_getCheckFlagResult_10.$$arity = 2);
    
    Opal.defn(self, '$getDownWill', TMP_DetatokoSaga_Korean_getDownWill_11 = function $$getDownWill(flag) {
      var $a, $b, self = this, dice = nil;

      
      if ($truthy($rb_ge(flag, 10))) {
        return "6"};
      $b = self.$roll(1, 6), $a = Opal.to_ary($b), (dice = ($a[0] == null ? nil : $a[0])), $b;
      return "" + "1D6->" + (dice);
    }, TMP_DetatokoSaga_Korean_getDownWill_11.$$arity = 1);
    
    Opal.defn(self, '$checkJudgeValue', TMP_DetatokoSaga_Korean_checkJudgeValue_12 = function $$checkJudgeValue(string) {
      var $a, $b, self = this, skill = nil, flag = nil, operator = nil, value = nil, result = nil, modifyText = nil, total = nil, rollText = nil, totalResult = nil;

      
      self.$debug("checkJudgeValue begin string", string);
      if ($truthy(/^(\d+)JD(\d+)?(([+]|[-]|[\/])(\d+))?$/i['$=~'](string))) {
        } else {
        return ""
      };
      skill = (($a = $gvars['~']) === nil ? nil : $a['$[]'](1)).$to_i();
      flag = (($a = $gvars['~']) === nil ? nil : $a['$[]'](2)).$to_i();
      operator = (($a = $gvars['~']) === nil ? nil : $a['$[]'](4));
      value = (($a = $gvars['~']) === nil ? nil : $a['$[]'](5)).$to_i();
      result = "" + "판정！　스킬레벨：" + (skill) + "　플래그：" + (flag);
      modifyText = self.$getModifyText(operator, value);
      if ($truthy(modifyText['$empty?']())) {
        } else {
        result = $rb_plus(result, "" + "　수정치：" + (modifyText))
      };
      $b = self.$getRollResult(skill), $a = Opal.to_ary($b), (total = ($a[0] == null ? nil : $a[0])), (rollText = ($a[1] == null ? nil : $a[1])), $b;
      result = $rb_plus(result, "" + " ＞ " + (total) + "[" + (rollText) + "]" + (modifyText));
      totalResult = self.$getTotalResultValue(total, value, operator);
      result = $rb_plus(result, "" + " ＞ " + (totalResult));
      result = $rb_plus(result, self.$getCheckFlagResult(total, flag));
      return result;
    }, TMP_DetatokoSaga_Korean_checkJudgeValue_12.$$arity = 1);
    
    Opal.defn(self, '$getModifyText', TMP_DetatokoSaga_Korean_getModifyText_13 = function $$getModifyText(operator, value) {
      var self = this, operatorText = nil, $case = nil;

      
      if ($truthy(value['$=='](0))) {
        return ""};
      operatorText = (function() {$case = operator;
      if ("+"['$===']($case)) {return "＋"}
      else if ("-"['$===']($case)) {return "－"}
      else if ("/"['$===']($case)) {return "÷"}
      else {return ""}})();
      return "" + (operatorText) + (value);
    }, TMP_DetatokoSaga_Korean_getModifyText_13.$$arity = 2);
    
    Opal.defn(self, '$getTotalResultValue', TMP_DetatokoSaga_Korean_getTotalResultValue_14 = function $$getTotalResultValue(total, value, operator) {
      var self = this, $case = nil;

      return (function() {$case = operator;
      if ("+"['$===']($case)) {return "" + (total) + "+" + (value) + " ＞ 판정치：" + ($rb_plus(total, value))}
      else if ("-"['$===']($case)) {return "" + (total) + "-" + (value) + " ＞ 판정치：" + ($rb_minus(total, value))}
      else if ("/"['$===']($case)) {return self.$getTotalResultValueWhenSlash(total, value)}
      else {return "" + "판정치：" + (total)}})()
    }, TMP_DetatokoSaga_Korean_getTotalResultValue_14.$$arity = 3);
    
    Opal.defn(self, '$getTotalResultValueWhenSlash', TMP_DetatokoSaga_Korean_getTotalResultValueWhenSlash_15 = function $$getTotalResultValueWhenSlash(total, value) {
      var self = this, quotient = nil, result = nil;

      
      if (value['$=='](0)) {
        return "0으로는 나누어지지 않습니다"};
      quotient = $rb_divide($rb_times(1.0, total), value).$ceil();
      result = "" + (total) + "÷" + (value) + " ＞ 판정치：" + (quotient);
      return result;
    }, TMP_DetatokoSaga_Korean_getTotalResultValueWhenSlash_15.$$arity = 2);
    
    Opal.defn(self, '$rollTableCommand', TMP_DetatokoSaga_Korean_rollTableCommand_16 = function $$rollTableCommand(command) {
      var $a, $b, self = this, result = nil, name = nil, text = nil, total = nil, $case = nil;

      
      command = command.$upcase();
      result = [];
      self.$debug("rollDiceCommand command", command);
      name = "";
      text = "";
      total = 0;
      $case = command.$upcase();
      if ("SST"['$===']($case) || "StrengthStigmaTable".$upcase()['$===']($case)) {$b = self.$choiceStrengthStigmaTable(), $a = Opal.to_ary($b), (name = ($a[0] == null ? nil : $a[0])), (text = ($a[1] == null ? nil : $a[1])), (total = ($a[2] == null ? nil : $a[2])), $b}
      else if ("WST"['$===']($case) || "WillStigmaTable".$upcase()['$===']($case)) {$b = self.$choiceWillStigmaTable(), $a = Opal.to_ary($b), (name = ($a[0] == null ? nil : $a[0])), (text = ($a[1] == null ? nil : $a[1])), (total = ($a[2] == null ? nil : $a[2])), $b}
      else if ("SBET"['$===']($case) || "StrengthBadEndTable".$upcase()['$===']($case)) {$b = self.$choiceStrengthBadEndTable(), $a = Opal.to_ary($b), (name = ($a[0] == null ? nil : $a[0])), (text = ($a[1] == null ? nil : $a[1])), (total = ($a[2] == null ? nil : $a[2])), $b}
      else if ("WBET"['$===']($case) || "WillBadEndTable".$upcase()['$===']($case)) {$b = self.$choiceWillBadEndTable(), $a = Opal.to_ary($b), (name = ($a[0] == null ? nil : $a[0])), (text = ($a[1] == null ? nil : $a[1])), (total = ($a[2] == null ? nil : $a[2])), $b}
      else {return nil};
      result = "" + (name) + "(" + (total) + ") ＞ " + (text);
      return result;
    }, TMP_DetatokoSaga_Korean_rollTableCommand_16.$$arity = 1);
    
    Opal.defn(self, '$choiceStrengthStigmaTable', TMP_DetatokoSaga_Korean_choiceStrengthStigmaTable_17 = function $$choiceStrengthStigmaTable() {
      var $a, $b, self = this, name = nil, table = nil, text = nil, total = nil;

      
      name = "체력 낙인표";
      table = ["당신은 【낙인】을 2개 받는다. 이 표를 다시 2번 굴려 받을 【낙인】을 정한다(그 경우, 다시 이 눈이 나와도 【낙인】은 늘어나지 않는다).", "【상처】 심한 상처를 입었다. 어떻게든 싸울 수는 있지만…….", "【출혈】 피가 흘러넘쳐, 눈이 흐릿하다…….", "【쇠약】 몸이 약해져, 그 마음마저도 시들어버릴 거 같다.", "【고통】 아픔과 괴로움, 한심함. 눈에서 눈물이 새어 나온다.", "【충격】 날려져서, 벽이나 나무에 부딪힌다. 빨리 일어서지 않으면.", "【피로】 당신의 얼굴에 피로의 색이 강해진다……이 싸움이 힘겨워졌다.", "【노호】 성가신 공격에 분노의 함성을 지른다. 분노가 싸움을 어렵게 할까?", "【부상】 상처를 입었다…….", "【경상】 당신의 피부에 상처가 남았다. 이것만이라면 아무렇지도 않다.", "기적적으로 당신은 【낙인】을 받지 않았다."];
      $b = self.$get_table_by_2d6(table), $a = Opal.to_ary($b), (text = ($a[0] == null ? nil : $a[0])), (total = ($a[1] == null ? nil : $a[1])), $b;
      return [name, text, total];
    }, TMP_DetatokoSaga_Korean_choiceStrengthStigmaTable_17.$$arity = 0);
    
    Opal.defn(self, '$choiceWillStigmaTable', TMP_DetatokoSaga_Korean_choiceWillStigmaTable_18 = function $$choiceWillStigmaTable() {
      var $a, $b, self = this, name = nil, table = nil, text = nil, total = nil;

      
      name = "기력 낙인표";
      table = ["당신은 【낙인】을 2개 받는다. 이 표를 다시 2번 굴려 받을 【낙인】을 정한다(그 경우, 다시 이 눈이 나와도 【낙인】은 늘어나지 않는다).", "【절망】 어떻게 하지 못하는 상황. 희망은 사라지고……무릎을 꿇을 수밖에 없다.", "【통곡】 너무도 부조리함에, 어린아이처럼 울음을 터트릴 수밖에 없다.", "【후회】 이럴 생각은 아니었는데. 하지만 현실은 비정했다.", "【공포】 공포에 사로잡혔다! 적이, 자신의 손이, 무서워서 참을 수 없다!", "【갈등】 정말로 이걸로 괜찮은 걸까? 몇 번이고 자신에게 의문이 일어난다…….", "【증오】 분노와 증오에 사로잡힌 당신은, 본래의 힘을 발휘할 수 있을까?", "【망연】 이것은 현실인가? 몽롱한 정신으로 당신은 생각한다.", "【주저】 망설임을 가졌다. 그것은 싸울 의지를 둔하게 할 것인가?", "【악몽】 이제부터 때때로, 당신은 이 순간을 악몽으로 볼 것이다.", "기적적으로 당신은 【낙인】을 받지 않았다."];
      $b = self.$get_table_by_2d6(table), $a = Opal.to_ary($b), (text = ($a[0] == null ? nil : $a[0])), (total = ($a[1] == null ? nil : $a[1])), $b;
      return [name, text, total];
    }, TMP_DetatokoSaga_Korean_choiceWillStigmaTable_18.$$arity = 0);
    
    Opal.defn(self, '$choiceStrengthBadEndTable', TMP_DetatokoSaga_Korean_choiceStrengthBadEndTable_19 = function $$choiceStrengthBadEndTable() {
      var $a, $b, self = this, name = nil, table = nil, text = nil, total = nil;

      
      name = "체력 배드엔딩표";
      table = ["【사망】 당신은 죽었다. 다음 세션에 참가하기 위해서는, 클래스 1개를 『몬스터』나 『암흑』으로 클래스 체인지해야만 한다.", "【목숨 구걸】 당신은 공포를 느껴, 목숨을 구걸했다! 다음 세션 개시 시에, 클래스 1개가 『자코』로 변경된다!", "【망각】 당신은 기억을 잃고, 우두커니 섰다. 다음 세션에 참가하기 위해서는, 클래스 1개를 변경해야만 한다.", "【비극】 당신의 공격은 적이 아니라 아군을 맞췄다! 모든 것이 끝날 때까지 당신은 우두커니 서 있게 된다. 임의의 아군의 【체력】을 1D6점 감소시킨다.", "【폭주】 당신은 이성을 잃고, 충동에 따라 폭주한다! 같은 씬에 있는 전원의 【체력】을 1D6점 감소시킨다.", "【전락】 당신은 단애절벽에서 떨어진다.", "【포로】 당신은 적에게 사로잡혔다.", "【도주】 당신은 겁에 질려, 동료를 버리고 도망쳤다.", "【중상】 당신은 어찌할 수 없는 상처를 입고, 쓰러졌다.", "【기절】 당신은 의식을 잃었다. 그리고 정신이 들면 모든 것이 끝나있었다.", "그래도 아직 일어선다! 당신은 배드엔드를 맞이하지 않았다. 체력의 【낙인】을 1개 지워도 좋다."];
      $b = self.$get_table_by_2d6(table), $a = Opal.to_ary($b), (text = ($a[0] == null ? nil : $a[0])), (total = ($a[1] == null ? nil : $a[1])), $b;
      return [name, text, total];
    }, TMP_DetatokoSaga_Korean_choiceStrengthBadEndTable_19.$$arity = 0);
    return (Opal.defn(self, '$choiceWillBadEndTable', TMP_DetatokoSaga_Korean_choiceWillBadEndTable_20 = function $$choiceWillBadEndTable() {
      var $a, $b, self = this, name = nil, table = nil, text = nil, total = nil;

      
      name = "기력 배드엔딩표";
      table = ["【자해】 당신은 스스로 죽음을 골랐다. 다음 세션에 참가하기 위해서는 클래스 1개를 『암흑』으로 클래스 체인지해야만 한다.", "【타락】 당신은 마음속의 어둠에 먹혔다. 다음 세션 개시 시에, 클래스 1개가 『암흑』이나 『몬스터』로 변경된다!", "【예속】 당신은 적의 말에 거스를 수 없다. 다음 세션에 당신의 스탠스는 『종속』이 된다.", "【배반】 배반의 충동. 임의의 아군의 【체력】을 1D6점 감소시키고, 그 자리에서 도망친다.", "【폭주】 당신은 이성을 잃고, 충동에 따라 폭주한다! 같은 씬에 있는 전원의 【체력】을 1D6점 감소시킨다.", "【저주】 마음의 어둠이 현재화한 것인가. 적의 원한인가. 저주에 삼켜진 당신은, 그저 고통에 몸부림칠 수밖에 없다.", "【포로】 당신은 적에게 사로잡혀, 그 자리에서 끌려갔다.", "【도주】 당신은 겁에 질려, 동료를 버리고 도망쳤다.", "【방심】 당신은 그저 멍하니 서 있을 수밖에 없다. 정신을 차렸을 때, 모든 것은 끝나있었다.", "【기절】 당신은 의식을 잃었다. 그리고 정신이 들면 모든 것이 끝나있었다.", "그래도 아직 포기하지 않아! 당신은 배드엔드를 맞이하지 않았다. 기력의 【낙인】을 1개 지워도 좋다."];
      $b = self.$get_table_by_2d6(table), $a = Opal.to_ary($b), (text = ($a[0] == null ? nil : $a[0])), (total = ($a[1] == null ? nil : $a[1])), $b;
      return [name, text, total];
    }, TMP_DetatokoSaga_Korean_choiceWillBadEndTable_20.$$arity = 0), nil) && 'choiceWillBadEndTable';
  })($nesting[0], Opal.const_get_relative($nesting, 'DiceBot'), $nesting)
})(Opal);

/* Generated by Opal 0.11.4 */
(function(Opal) {
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;

  Opal.add_stubs(['$exit']);
  return Opal.const_get_relative($nesting, 'Kernel').$exit()
})(Opal);
