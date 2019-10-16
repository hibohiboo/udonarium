/* Generated by Opal 0.11.4 */
(function(Opal) {
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_lt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$setPrefixes', '$===', '$to_i', '$last_match', '$delete', '$sort', '$uniq', '$!', '$nil?', '$checkRoll', '$roll', '$collect', '$split', '$each', '$>', '$count', '$push', '$+', '$join', '$<']);
  return (function($base, $super, $parent_nesting) {
    function $Illusio(){};
    var self = $Illusio = $klass($base, $super, 'Illusio', $Illusio);

    var def = self.$$proto, $nesting = [self].concat($parent_nesting), TMP_Illusio_initialize_1, TMP_Illusio_gameName_2, TMP_Illusio_gameType_3, TMP_Illusio_getHelpMessage_4, TMP_Illusio_rollDiceCommand_5, TMP_Illusio_checkRoll_8;

    def.sortTye = nil;
    
    
    Opal.defn(self, '$initialize', TMP_Illusio_initialize_1 = function $$initialize() {
      var self = this, $iter = TMP_Illusio_initialize_1.$$p, $yield = $iter || nil, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) TMP_Illusio_initialize_1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', TMP_Illusio_initialize_1, false), $zuper, $iter);
      return (self.sortType = 1);
    }, TMP_Illusio_initialize_1.$$arity = 0);
    self.$setPrefixes(["(\\d+)?IL([1-6])?([1-6])?([1-6])?([1-6])?([1-6])?([1-6])?(P)?"]);
    
    Opal.defn(self, '$gameName', TMP_Illusio_gameName_2 = function $$gameName() {
      var self = this;

      return "晃天のイルージオ"
    }, TMP_Illusio_gameName_2.$$arity = 0);
    
    Opal.defn(self, '$gameType', TMP_Illusio_gameType_3 = function $$gameType() {
      var self = this;

      return "Illusio"
    }, TMP_Illusio_gameType_3.$$arity = 0);
    
    Opal.defn(self, '$getHelpMessage', TMP_Illusio_getHelpMessage_4 = function $$getHelpMessage() {
      var self = this;

      return "" + "判定：[n]IL(BNo)[P]\n" + "\n" + "[]内のコマンドは省略可能。\n" + "「n」でダイス数を指定。省略時は「1」。\n" + "(BNo)でブロックナンバーを指定。「236」のように記述。順不同可。\n" + "コマンド末に「P」を指定で、(BNo)のパリィ判定。（一応、複数指定可）\n" + "\n" + "【書式例】\n" + "・6IL236 → 6dでブロックナンバー「2,3,6」の判定。\n" + "・IL4512 → 1dでブロックナンバー「1,2,4,5」の判定。\n" + "・2IL1P → 2dでパリィナンバー「1」の判定。\n"
    }, TMP_Illusio_getHelpMessage_4.$$arity = 0);
    
    Opal.defn(self, '$rollDiceCommand', TMP_Illusio_rollDiceCommand_5 = function $$rollDiceCommand(command) {
      var $a, self = this, diceCount = nil, blockNo = nil, isParry = nil;

      
      if ($truthy(/(\d+)?IL([1-6])?([1-6])?([1-6])?([1-6])?([1-6])?([1-6])?(P)?$/i['$==='](command))) {
        
        diceCount = ($truthy($a = Opal.const_get_relative($nesting, 'Regexp').$last_match(1)) ? $a : 1).$to_i();
        blockNo = [($truthy($a = Opal.const_get_relative($nesting, 'Regexp').$last_match(2)) ? $a : 0).$to_i(), ($truthy($a = Opal.const_get_relative($nesting, 'Regexp').$last_match(3)) ? $a : 0).$to_i(), ($truthy($a = Opal.const_get_relative($nesting, 'Regexp').$last_match(4)) ? $a : 0).$to_i(), ($truthy($a = Opal.const_get_relative($nesting, 'Regexp').$last_match(5)) ? $a : 0).$to_i(), ($truthy($a = Opal.const_get_relative($nesting, 'Regexp').$last_match(6)) ? $a : 0).$to_i(), ($truthy($a = Opal.const_get_relative($nesting, 'Regexp').$last_match(7)) ? $a : 0).$to_i()];
        blockNo.$delete(0);
        blockNo = blockNo.$sort();
        blockNo = blockNo.$uniq();
        isParry = Opal.const_get_relative($nesting, 'Regexp').$last_match(8)['$nil?']()['$!']();
        return self.$checkRoll(diceCount, blockNo, isParry);};
      return nil;
    }, TMP_Illusio_rollDiceCommand_5.$$arity = 1);
    return (Opal.defn(self, '$checkRoll', TMP_Illusio_checkRoll_8 = function $$checkRoll(diceCount, blockNo, isParry) {
      var $a, $b, TMP_6, TMP_7, self = this, dice = nil, diceText = nil, diceArray = nil, resultArray = nil, success = nil, blockText = nil, blockText2 = nil, resultText = nil, result = nil;

      
      $b = self.$roll(diceCount, 6, self.sortTye), $a = Opal.to_ary($b), (dice = ($a[0] == null ? nil : $a[0])), (diceText = ($a[1] == null ? nil : $a[1])), $b;
      diceArray = $send(diceText.$split(/,/), 'collect', [], (TMP_6 = function(i){var self = TMP_6.$$s || this;
if (i == null) i = nil;
      return i.$to_i()}, TMP_6.$$s = self, TMP_6.$$arity = 1, TMP_6));
      resultArray = [];
      success = 0;
      $send(diceArray, 'each', [], (TMP_7 = function(i){var self = TMP_7.$$s || this;
if (i == null) i = nil;
      if ($truthy($rb_gt(blockNo.$count(i), 0))) {
          return resultArray.$push("×")
          } else {
          
          resultArray.$push(i);
          return (success = $rb_plus(success, 1));
        }}, TMP_7.$$s = self, TMP_7.$$arity = 1, TMP_7));
      blockText = blockNo.$join(",");
      blockText2 = "Block";
      if ($truthy(isParry)) {
        blockText2 = "Parry"};
      resultText = resultArray.$join(",");
      result = "" + (diceCount) + "D6(" + (blockText2) + ":" + (blockText) + ") ＞ " + (diceText) + " ＞ " + (resultText) + " ＞ ";
      if ($truthy(isParry)) {
        if ($truthy($rb_lt(success, diceCount))) {
          result = $rb_plus(result, "パリィ成立！　次の非ダメージ2倍。")
          } else {
          result = $rb_plus(result, "" + "成功数：" + (success) + "　パリィ失敗")
        }
        } else {
        result = $rb_plus(result, "" + "成功数：" + (success))
      };
      return result;
    }, TMP_Illusio_checkRoll_8.$$arity = 3), nil) && 'checkRoll';
  })($nesting[0], Opal.const_get_relative($nesting, 'DiceBot'), $nesting)
})(Opal);

/* Generated by Opal 0.11.4 */
(function(Opal) {
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;

  Opal.add_stubs(['$exit']);
  return Opal.const_get_relative($nesting, 'Kernel').$exit()
})(Opal);
