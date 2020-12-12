/* Generated by Opal 1.0.3 */
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
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  function $rb_divide(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
  }
  function $rb_times(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
  } 
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy, $gvars = Opal.gvars;

  Opal.add_stubs(['$setPrefixes', '$===', '$getRegistResult', '$getCombineRoll', '$getIdoResultText', '$=~', '$to_i', '$>', '$+', '$to_s', '$<', '$==', '$roll', '$getCheckResultText2', '$getCheckResultText3', '$getCheckResultText', '$>=', '$<=', '$/', '$*', '$index', '$max', '$[]']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'Ido');

    var $nesting = [self].concat($parent_nesting), $Ido_initialize$1, $Ido_rollDiceCommand$2, $Ido_getIdoResultText$3, $Ido_check_1D100$4, $Ido_getCheckResultText$5, $Ido_getCheckResultText2$6, $Ido_getCheckResultText3$7, $Ido_getRegistResult$8, $Ido_getCombineRoll$9;


    Opal.const_set($nesting[0], 'ID', "Ido");
    Opal.const_set($nesting[0], 'NAME', "イドの証明");
    Opal.const_set($nesting[0], 'SORT_KEY', "いどのしょうめい");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "・COC6版ダイスボットをベースに拡張してあります\n" + "　※ファンブ ル値以上の出目の場合目標値が上回っていてもファンブルとなるように変更\n" + "・抵抗ロール　(RES(x-n))\n" + "　従来どおり\n" + "　\n" + "・組み合わせ判定　(CBR(x,y))\n" + "　従来どおり\n" + "\n" + "・専用命令　(ID<=x(追加文字))\n" + "　使用例 ）　技能値200で判定する場合　\n" + "　ID<=200　　（1d100<=200と同じ）\n" + "　(ID<=200) → 31 → スペシャル\n" + "　\n" + "　■追加文字定義\n" + "　　Fxx　：F値xxで判定\n" + "　　　ID<=200F90\n" + "　　　 (ID<=200F90) F90 → 91 → 致命的失 敗\n" + "　　Sx 　：S値を1/xに変更する\n" + "　　　ID<=200S3\n" + "　　　(ID<=200S3) S3 → 65 → スペシャル\n" + "　　Cx 　：C値をxに変更する\n" + "　　　ID<=200C10\n" + "　　　(ID<=200C10) C10 → 10 → 決定的成功/スペシャル\n" + "　　P　　：パーフェクトオーダーS値1/4、C10で判定(S4C10と同じ)\n" + "　　　ID<=200P\n" + "　　　(ID<=200P) S4 C10 → 41 → スペシ ャル\n" + "　　B　　：ボスフラグF値100で判定(F100と同じ)\n" + "　　　ID<=200B\n" + "　　　 (ID<=200B) F100 → 99 → 成功\n" + "　　複数種同時定義可能\n" + "　　　ID<=200BC20S3　ボスがC値20S1/3で判定\n" + "　　　 (ID<=200BC20S3) S3 C20 F100 → 15 → 決定的成功/スペシャル\n" + "　　\n" + "　■複数判定\n" + "　　複数回の判定結果を\n" + "　　C（クリティカル）S（スペシャル）1C（1クリ）F（ファンブル）\n" + "　　100F（100ファンブル）N（通常成功）X（失敗）で表示\n" + "　　\n" + "　　IDn<=x　で目標値xでn回判定\n" + "　　　ID4<=85　　修験律動4人掛け等\n" + "　　　(ID4<=85) 目標値85 判定数4 → 73,60,12,64 → N,N,S,N\n" + "　　\n" + "　　追加文字定義可能\n" + "　　　ID3<=120PB　パフェオボス乱槍\n" + "　　　 (ID3<=120PB) S4 C10 F100 目標値120 判定数3 → 4,81,21 → C,N,S\n");
    self.$setPrefixes(["RES.*", "CBR\\(\\d+,\\d+\\)", "ID.*"]);

    Opal.def(self, '$initialize', $Ido_initialize$1 = function $$initialize() {
      var $iter = $Ido_initialize$1.$$p, $yield = $iter || nil, self = this, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) $Ido_initialize$1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      return $send(self, Opal.find_super_dispatcher(self, 'initialize', $Ido_initialize$1, false), $zuper, $iter)
    }, $Ido_initialize$1.$$arity = 0);

    Opal.def(self, '$rollDiceCommand', $Ido_rollDiceCommand$2 = function $$rollDiceCommand(command) {
      var self = this, $case = nil;


      $case = command;
      if (/RES/i['$===']($case)) {return self.$getRegistResult(command)}
      else if (/CBR/i['$===']($case)) {return self.$getCombineRoll(command)}
      else if (/ID/i['$===']($case)) {return self.$getIdoResultText(command)};
      return nil;
    }, $Ido_rollDiceCommand$2.$$arity = 1);

    Opal.def(self, '$getIdoResultText', $Ido_getIdoResultText$3 = function $$getIdoResultText(command) {
      var $a, $b, $c, self = this, special = nil, fumble = nil, critical = nil, dicenum = nil, trg = nil, maxdice = nil, output = nil, stxt = nil, ctxt = nil, ftxt = nil, ret = nil, total = nil, dummy = nil, result_1 = nil, count = nil, result_mes = nil, result_d = nil, s_count = nil, c_count = nil, c1_count = nil, f_count = nil, f100_count = nil, n_count = nil, x_count = nil;


      special = 5;
      fumble = 96;
      critical = 5;
      dicenum = 1;
      trg = 0;
      maxdice = 20;
      output = "1";
      if ($truthy(/ID.*/['$=~'](command))) {
      } else {
        return output
      };
      if ($truthy(/<=(\d+)/['$=~'](command))) {
      } else {
        return output
      };
      trg = (($a = $gvars['~']) === nil ? nil : $a['$[]'](1)).$to_i();
      if ($truthy(/(ID)(\d+)/['$=~'](command))) {

        dicenum = (($a = $gvars['~']) === nil ? nil : $a['$[]'](2)).$to_i();
        if ($truthy($rb_gt(dicenum, 20))) {
          return $rb_plus($rb_plus("ダイス個数は", maxdice.$to_s()), "までです")};};
      stxt = "";
      ctxt = "";
      ftxt = "";
      if ($truthy(/ID.*P/['$=~'](command))) {

        critical = 10;
        special = 4;
        stxt = " S4";
        ctxt = " C10";};
      if ($truthy(/ID.*C(\d+)/['$=~'](command))) {

        critical = (($a = $gvars['~']) === nil ? nil : $a['$[]'](1)).$to_i();
        ctxt = $rb_plus(" C", critical.$to_s());};
      if ($truthy(/ID.*S(\d+)/['$=~'](command))) {

        special = (($a = $gvars['~']) === nil ? nil : $a['$[]'](1)).$to_i();
        stxt = $rb_plus(" S", special.$to_s());};
      if ($truthy(/ID.*B/['$=~'](command))) {

        fumble = 100;
        ftxt = $rb_plus(" F", fumble.$to_s());};
      if ($truthy(/ID.*F(\d+)/['$=~'](command))) {

        fumble = (($a = $gvars['~']) === nil ? nil : $a['$[]'](1)).$to_i();
        ftxt = $rb_plus(" F", fumble.$to_s());};
      if ($truthy($rb_lt(special, 0))) {

        special = 1;
        stxt = $rb_plus(" S", special.$to_s());};
      ret = "";
      if (dicenum['$=='](1)) {

        $b = self.$roll(1, 100), $a = Opal.to_ary($b), (total = ($a[0] == null ? nil : $a[0])), (dummy = ($a[1] == null ? nil : $a[1])), $b;
        result_1 = self.$getCheckResultText2(total, trg, special, critical, fumble);
        return "" + "(" + (command) + ")" + (stxt) + (ctxt) + (ftxt) + " ＞ " + (total.$to_s()) + " ＞ " + (result_1);
      } else {

        count = 0;
        result_mes = "";
        result_d = "";
        s_count = 0;
        c_count = 0;
        c1_count = 0;
        f_count = 0;
        f100_count = 0;
        n_count = 0;
        x_count = 0;
        while ($truthy($rb_lt(count, dicenum))) {

          $c = self.$roll(1, 100), $b = Opal.to_ary($c), (total = ($b[0] == null ? nil : $b[0])), (dummy = ($b[1] == null ? nil : $b[1])), $c;
          result_1 = self.$getCheckResultText3(total, trg, special, critical, fumble);
          if ($truthy($rb_gt(count, 0))) {

            result_mes = $rb_plus($rb_plus(result_mes, ","), result_1);
            result_d = $rb_plus($rb_plus(result_d, ","), total.$to_s());
          } else {

            result_mes = result_1;
            result_d = total.$to_s();
          };
          count = $rb_plus(count, 1);
        };
        return "" + "(" + (command) + ")" + (stxt) + (ctxt) + (ftxt) + " 目標値" + (trg.$to_s()) + " 判定数" + (dicenum.$to_s()) + " ＞ " + (result_d) + " ＞ " + (result_mes);
      };
    }, $Ido_getIdoResultText$3.$$arity = 1);

    Opal.def(self, '$check_1D100', $Ido_check_1D100$4 = function $$check_1D100(total_n, dice_n, signOfInequality, diff, dice_cnt, dice_max, n1, n_max) {
      var self = this;


      if ($truthy(signOfInequality['$==']("<="))) {
      } else {
        return ""
      };
      return $rb_plus(" ＞ ", self.$getCheckResultText(total_n, diff));
    }, $Ido_check_1D100$4.$$arity = 8);

    Opal.def(self, '$getCheckResultText', $Ido_getCheckResultText$5 = function $$getCheckResultText(total_n, diff) {
      var $a, self = this;


      if ($truthy($rb_ge(total_n, 96))) {
        return "致命的失敗"};
      if ($truthy(($truthy($a = $rb_le(total_n, diff)) ? $rb_lt(total_n, 100) : $a))) {

        if ($truthy($rb_le(total_n, 5))) {

          if ($truthy($rb_le(total_n, $rb_divide(diff, 5)))) {
            return "決定的成功/スペシャル"};
          return "決定的成功";};
        if ($truthy($rb_le(total_n, $rb_divide(diff, 5)))) {
          return "スペシャル"};
        return "成功";};
      return "失敗";
    }, $Ido_getCheckResultText$5.$$arity = 2);

    Opal.def(self, '$getCheckResultText2', $Ido_getCheckResultText2$6 = function $$getCheckResultText2(total_n, diff, special, critical, fumble) {
      var $a, self = this;


      if ($truthy($rb_ge(total_n, fumble))) {
        return "致命的失敗"};
      if ($truthy(($truthy($a = $rb_le(total_n, diff)) ? $rb_lt(total_n, 100) : $a))) {

        if ($truthy($rb_le(total_n, critical))) {

          if ($truthy($rb_le(total_n, $rb_divide(diff, special)))) {
            return "決定的成功/スペシャル"};
          return "決定的成功";};
        if ($truthy($rb_le(total_n, $rb_divide(diff, special)))) {
          return "スペシャル"};
        return "成功";};
      return "失敗";
    }, $Ido_getCheckResultText2$6.$$arity = 5);

    Opal.def(self, '$getCheckResultText3', $Ido_getCheckResultText3$7 = function $$getCheckResultText3(total_n, diff, special, critical, fumble) {
      var $a, self = this;


      if ($truthy($rb_ge(total_n, fumble))) {
        if ($truthy($rb_ge(total_n, 100))) {
          return "100F"}};
      if ($truthy($rb_ge(total_n, fumble))) {
        return "F"};
      if ($truthy(($truthy($a = $rb_le(total_n, diff)) ? $rb_lt(total_n, 100) : $a))) {

        if ($truthy($rb_le(total_n, 1))) {
          return "1C"};
        if ($truthy($rb_le(total_n, critical))) {

          if ($truthy($rb_le(total_n, $rb_divide(diff, special)))) {
            return "C"};
          return "C";};
        if ($truthy($rb_le(total_n, $rb_divide(diff, special)))) {
          return "S"};
        return "N";};
      return "X";
    }, $Ido_getCheckResultText3$7.$$arity = 5);

    Opal.def(self, '$getRegistResult', $Ido_getRegistResult$8 = function $$getRegistResult(command) {
      var $a, $b, self = this, output = nil, value = nil, target = nil, total_n = nil, dice_dmy = nil;


      output = "1";
      if ($truthy(/res([-\d]+)/i['$=~'](command))) {
      } else {
        return output
      };
      value = (($a = $gvars['~']) === nil ? nil : $a['$[]'](1)).$to_i();
      target = $rb_plus($rb_times(value, 5), 50);
      if ($truthy($rb_lt(target, 5))) {
        return "" + "(1d100<=" + (target) + ") ＞ 自動失敗"};
      if ($truthy($rb_gt(target, 95))) {
        return "" + "(1d100<=" + (target) + ") ＞ 自動成功"};
      $b = self.$roll(1, 100), $a = Opal.to_ary($b), (total_n = ($a[0] == null ? nil : $a[0])), (dice_dmy = ($a[1] == null ? nil : $a[1])), $b;
      if ($truthy($rb_le(total_n, target))) {
        return "" + "(1d100<=" + (target) + ") ＞ " + (total_n) + " ＞ 成功"};
      return "" + "(1d100<=" + (target) + ") ＞ " + (total_n) + " ＞ 失敗";
    }, $Ido_getRegistResult$8.$$arity = 1);
    return (Opal.def(self, '$getCombineRoll', $Ido_getCombineRoll$9 = function $$getCombineRoll(command) {
      var $a, $b, self = this, output = nil, diff_1 = nil, diff_2 = nil, total = nil, dummy = nil, result_1 = nil, result_2 = nil, ranks = nil, rankIndex_1 = nil, rankIndex_2 = nil, rankIndex = nil, rank = nil;


      output = "1";
      if ($truthy(/CBR\((\d+),(\d+)\)/i['$=~'](command))) {
      } else {
        return output
      };
      diff_1 = (($a = $gvars['~']) === nil ? nil : $a['$[]'](1)).$to_i();
      diff_2 = (($a = $gvars['~']) === nil ? nil : $a['$[]'](2)).$to_i();
      $b = self.$roll(1, 100), $a = Opal.to_ary($b), (total = ($a[0] == null ? nil : $a[0])), (dummy = ($a[1] == null ? nil : $a[1])), $b;
      result_1 = self.$getCheckResultText(total, diff_1);
      result_2 = self.$getCheckResultText(total, diff_2);
      ranks = ["決定的成功/スペシャル", "決定的成功", "スペシャル", "成功", "失敗", "致命的失敗"];
      rankIndex_1 = ranks.$index(result_1);
      rankIndex_2 = ranks.$index(result_2);
      rankIndex = [rankIndex_1, rankIndex_2].$max();
      rank = ranks['$[]'](rankIndex);
      return "" + "(1d100<=" + (diff_1) + "," + (diff_2) + ") ＞ " + (total) + "[" + (result_1) + "," + (result_2) + "] ＞ " + (rank);
    }, $Ido_getCombineRoll$9.$$arity = 1), nil) && 'getCombineRoll';
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting)
})(Opal);