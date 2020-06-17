/* Generated by Opal 0.11.4 */
(function(Opal) {
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $truthy = Opal.truthy;

  Opal.add_stubs(['$==', '$<=', '$>=', '$-']);
  return (function($base, $super, $parent_nesting) {
    function $Pendragon(){};
    var self = $Pendragon = $klass($base, $super, 'Pendragon', $Pendragon);

    var def = self.$$proto, $nesting = [self].concat($parent_nesting), TMP_Pendragon_gameName_1, TMP_Pendragon_gameType_2, TMP_Pendragon_getHelpMessage_3, TMP_Pendragon_check_1D20_4;

    
    
    Opal.defn(self, '$gameName', TMP_Pendragon_gameName_1 = function $$gameName() {
      var self = this;

      return "ペンドラゴン"
    }, TMP_Pendragon_gameName_1.$$arity = 0);
    
    Opal.defn(self, '$gameType', TMP_Pendragon_gameType_2 = function $$gameType() {
      var self = this;

      return "Pendragon"
    }, TMP_Pendragon_gameType_2.$$arity = 0);
    
    Opal.defn(self, '$getHelpMessage', TMP_Pendragon_getHelpMessage_3 = function $$getHelpMessage() {
      var self = this;

      return "クリティカル、成功、失敗、ファンブルの自動判定を行います。\n"
    }, TMP_Pendragon_getHelpMessage_3.$$arity = 0);
    return (Opal.defn(self, '$check_1D20', TMP_Pendragon_check_1D20_4 = function $$check_1D20(total_n, _dice_n, signOfInequality, diff, _dice_cnt, _dice_max, _n1, _n_max) {
      var $a, self = this;

      
      if (signOfInequality['$==']("<=")) {
        } else {
        return ""
      };
      if ($truthy($rb_le(total_n, diff))) {
        
        if ($truthy(($truthy($a = $rb_ge(total_n, $rb_minus(40, diff))) ? $a : total_n['$=='](diff)))) {
          return " ＞ クリティカル"};
        return " ＞ 成功";
        } else {
        
        if (total_n['$=='](20)) {
          return " ＞ ファンブル"};
        return " ＞ 失敗";
      };
    }, TMP_Pendragon_check_1D20_4.$$arity = 8), nil) && 'check_1D20';
  })($nesting[0], Opal.const_get_relative($nesting, 'DiceBot'), $nesting)
})(Opal);

/* Generated by Opal 0.11.4 */
(function(Opal) {
  var self = Opal.top, $nesting = [], nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;

  Opal.add_stubs(['$exit']);
  return Opal.const_get_relative($nesting, 'Kernel').$exit()
})(Opal);