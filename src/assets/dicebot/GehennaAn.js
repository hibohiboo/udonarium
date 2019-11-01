/* Generated by Opal 0.11.4 */
(function(Opal) {
  function $rb_lt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_times(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  function $rb_divide(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$setPrefixes', '$gsub', '$last_match', '$checkGehenaAn', '$=~', '$to_i', '$parren_killer', '$roll', '$&', '$sortType', '$collect', '$split', '$each', '$!=', '$<', '$>=', '$+', '$>', '$*', '$-', '$to_s', '$getAnastasisBonusText', '$==', '$/', '$getTougiBonus', '$get_table_by_number']);
  return (function($base, $super, $parent_nesting) {
    function $GehennaAn(){};
    var self = $GehennaAn = $klass($base, $super, 'GehennaAn', $GehennaAn);

    var def = self.$$proto, $nesting = [self].concat($parent_nesting), TMP_GehennaAn_initialize_1, TMP_GehennaAn_gameName_2, TMP_GehennaAn_gameType_3, TMP_GehennaAn_getHelpMessage_4, TMP_GehennaAn_changeText_9, TMP_GehennaAn_dice_command_xRn_10, TMP_GehennaAn_checkGehenaAn_13, TMP_GehennaAn_getAnastasisBonusText_14, TMP_GehennaAn_getTougiBonus_15;

    
    self.$setPrefixes(["(\\d+G\\d+|\\d+GA\\d+)"]);
    
    Opal.defn(self, '$initialize', TMP_GehennaAn_initialize_1 = function $$initialize() {
      var self = this, $iter = TMP_GehennaAn_initialize_1.$$p, $yield = $iter || nil, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) TMP_GehennaAn_initialize_1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', TMP_GehennaAn_initialize_1, false), $zuper, $iter);
      self.sendMode = 3;
      return (self.sortType = 3);
    }, TMP_GehennaAn_initialize_1.$$arity = 0);
    
    Opal.defn(self, '$gameName', TMP_GehennaAn_gameName_2 = function $$gameName() {
      var self = this;

      return "ゲヘナ・アナスタシス"
    }, TMP_GehennaAn_gameName_2.$$arity = 0);
    
    Opal.defn(self, '$gameType', TMP_GehennaAn_gameType_3 = function $$gameType() {
      var self = this;

      return "GehennaAn"
    }, TMP_GehennaAn_gameType_3.$$arity = 0);
    
    Opal.defn(self, '$getHelpMessage', TMP_GehennaAn_getHelpMessage_4 = function $$getHelpMessage() {
      var self = this;

      return "" + "戦闘判定と通常判定に対応。幸運の助け、連撃増加値(戦闘判定)、闘技チット(戦闘判定)を自動表示します。\n" + "・戦闘判定　(nGAt+m)\n" + "　ダイス数n、目標値t、修正値mで戦闘判定を行います。\n" + "　幸運の助け、連撃増加値、闘技チットを自動処理します。\n" + "・通常判定　(nGt+m)\n" + "　ダイス数n、目標値t、修正値mで通常判定を行います。\n" + "　幸運の助けを自動処理します。(連撃増加値、闘技チットを表示抑制します)\n"
    }, TMP_GehennaAn_getHelpMessage_4.$$arity = 0);
    
    Opal.defn(self, '$changeText', TMP_GehennaAn_changeText_9 = function $$changeText(string) {
      var TMP_5, TMP_6, TMP_7, TMP_8, self = this;

      
      string = $send(string, 'gsub', [/(\d+)GA(\d+)([\+\-][\+\-\d]+)/], (TMP_5 = function(){var self = TMP_5.$$s || this;

      return "" + (Opal.const_get_relative($nesting, 'Regexp').$last_match(1)) + "R6" + (Opal.const_get_relative($nesting, 'Regexp').$last_match(3)) + ">=" + (Opal.const_get_relative($nesting, 'Regexp').$last_match(2)) + "[1]"}, TMP_5.$$s = self, TMP_5.$$arity = 0, TMP_5));
      string = $send(string, 'gsub', [/(\d+)GA(\d+)/], (TMP_6 = function(){var self = TMP_6.$$s || this;

      return "" + (Opal.const_get_relative($nesting, 'Regexp').$last_match(1)) + "R6>=" + (Opal.const_get_relative($nesting, 'Regexp').$last_match(2)) + "[1]"}, TMP_6.$$s = self, TMP_6.$$arity = 0, TMP_6));
      string = $send(string, 'gsub', [/(\d+)G(\d+)([\+\-][\+\-\d]+)/], (TMP_7 = function(){var self = TMP_7.$$s || this;

      return "" + (Opal.const_get_relative($nesting, 'Regexp').$last_match(1)) + "R6" + (Opal.const_get_relative($nesting, 'Regexp').$last_match(3)) + ">=" + (Opal.const_get_relative($nesting, 'Regexp').$last_match(2)) + "[0]"}, TMP_7.$$s = self, TMP_7.$$arity = 0, TMP_7));
      return (string = $send(string, 'gsub', [/(\d+)G(\d+)/], (TMP_8 = function(){var self = TMP_8.$$s || this;

      return "" + (Opal.const_get_relative($nesting, 'Regexp').$last_match(1)) + "R6>=" + (Opal.const_get_relative($nesting, 'Regexp').$last_match(2)) + "[0]"}, TMP_8.$$s = self, TMP_8.$$arity = 0, TMP_8)));
    }, TMP_GehennaAn_changeText_9.$$arity = 1);
    
    Opal.defn(self, '$dice_command_xRn', TMP_GehennaAn_dice_command_xRn_10 = function $$dice_command_xRn(string, nick_e) {
      var self = this;

      return self.$checkGehenaAn(string, nick_e)
    }, TMP_GehennaAn_dice_command_xRn_10.$$arity = 2);
    
    Opal.defn(self, '$checkGehenaAn', TMP_GehennaAn_checkGehenaAn_13 = function $$checkGehenaAn(string, nick_e) {
      var $a, $b, TMP_11, TMP_12, self = this, output = nil, diceCount = nil, modText = nil, diff = nil, mode = nil, mod = nil, diceValue = nil, diceText = nil, diceArray = nil, dice_1st = nil, isLuck = nil, success = nil, failed = nil;

      
      output = "1";
      if ($truthy(/(^|\s)S?((\d+)[rR]6([\+\-\d]+)?([>=]+(\d+))(\[(\d)\]))(\s|$)/i['$=~'](string))) {
        } else {
        return output
      };
      string = Opal.const_get_relative($nesting, 'Regexp').$last_match(2);
      diceCount = Opal.const_get_relative($nesting, 'Regexp').$last_match(3).$to_i();
      modText = Opal.const_get_relative($nesting, 'Regexp').$last_match(4);
      diff = Opal.const_get_relative($nesting, 'Regexp').$last_match(6).$to_i();
      mode = Opal.const_get_relative($nesting, 'Regexp').$last_match(8).$to_i();
      mod = self.$parren_killer("" + "(0" + (modText) + ")").$to_i();
      $b = self.$roll(diceCount, 6, self.$sortType()['$&'](1)), $a = Opal.to_ary($b), (diceValue = ($a[0] == null ? nil : $a[0])), (diceText = ($a[1] == null ? nil : $a[1])), $b;
      diceArray = $send(diceText.$split(/,/), 'collect', [], (TMP_11 = function(i){var self = TMP_11.$$s || this;
if (i == null) i = nil;
      return i.$to_i()}, TMP_11.$$s = self, TMP_11.$$arity = 1, TMP_11));
      dice_1st = "";
      isLuck = true;
      diceValue = 0;
      $send(diceArray, 'each', [], (TMP_12 = function(i){var self = TMP_12.$$s || this, $c;
if (i == null) i = nil;
      
        if ($truthy(dice_1st['$!='](""))) {
          if ($truthy(($truthy($c = dice_1st['$!='](i)) ? $c : $rb_lt(i, diff)))) {
            isLuck = false}
          } else {
          dice_1st = i
        };
        if ($truthy($rb_ge(i, diff))) {
          return (diceValue = $rb_plus(diceValue, 1))
          } else {
          return nil
        };}, TMP_12.$$s = self, TMP_12.$$arity = 1, TMP_12));
      if ($truthy(($truthy($a = isLuck) ? $rb_gt(diceCount, 1) : $a))) {
        diceValue = $rb_times(diceValue, 2)};
      output = "" + (diceValue) + "[" + (diceText) + "]";
      success = $rb_plus(diceValue, mod);
      if ($truthy($rb_lt(success, 0))) {
        success = 0};
      failed = $rb_minus(diceCount, diceValue);
      if ($truthy($rb_lt(failed, 0))) {
        failed = 0};
      if ($truthy($rb_gt(mod, 0))) {
        output = $rb_plus(output, "" + "+" + (mod))
      } else if ($truthy($rb_lt(mod, 0))) {
        output = $rb_plus(output, mod.$to_s())};
      if ($truthy(/[^\d\[\]]+/['$=~'](output))) {
        output = "" + (nick_e) + ": (" + (string) + ") ＞ " + (output) + " ＞ 成功" + (success) + "、失敗" + (failed)
        } else {
        output = "" + (nick_e) + ": (" + (string) + ") ＞ " + (output)
      };
      output = $rb_plus(output, self.$getAnastasisBonusText(mode, success));
      return output;
    }, TMP_GehennaAn_checkGehenaAn_13.$$arity = 2);
    
    Opal.defn(self, '$getAnastasisBonusText', TMP_GehennaAn_getAnastasisBonusText_14 = function $$getAnastasisBonusText(mode, success) {
      var self = this, ma_bonus = nil, bonus_str = nil;

      
      if (mode['$=='](0)) {
        return ""};
      ma_bonus = $rb_divide($rb_minus(success, 1), 2).$to_i();
      if ($truthy($rb_gt(ma_bonus, 7))) {
        ma_bonus = 7};
      bonus_str = "";
      if ($truthy($rb_gt(ma_bonus, 0))) {
        bonus_str = $rb_plus(bonus_str, "" + "連撃[+" + (ma_bonus) + "]/")};
      bonus_str = $rb_plus(bonus_str, "" + "闘技[" + (self.$getTougiBonus(success)) + "]");
      return "" + " ＞ " + (bonus_str);
    }, TMP_GehennaAn_getAnastasisBonusText_14.$$arity = 2);
    return (Opal.defn(self, '$getTougiBonus', TMP_GehennaAn_getTougiBonus_15 = function $$getTougiBonus(success) {
      var self = this, table = nil;

      
      table = [[6, "1"], [13, "2"], [18, "3"], [22, "4"], [99, "5"]];
      return self.$get_table_by_number(success, table);
    }, TMP_GehennaAn_getTougiBonus_15.$$arity = 1), nil) && 'getTougiBonus';
  })($nesting[0], Opal.const_get_relative($nesting, 'DiceBot'), $nesting)
})(Opal);

/* Generated by Opal 0.11.4 */
(function(Opal) {
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;

  Opal.add_stubs(['$exit']);
  return Opal.const_get_relative($nesting, 'Kernel').$exit()
})(Opal);
