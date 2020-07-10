/* Generated by Opal 1.0.3 */
(function(Opal) {
  function $rb_le(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
  }
  function $rb_divide(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
  }
  function $rb_minus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
  }
  function $rb_gt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
  }
  function $rb_lt(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
  }
  function $rb_times(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
  }
  function $rb_plus(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
  }
  function $rb_ge(lhs, rhs) {
    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
  }
  var self = Opal.top, $nesting = [], nil = Opal.nil, $$$ = Opal.const_get_qualified, $$ = Opal.const_get_relative, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $send = Opal.send, $truthy = Opal.truthy;

  Opal.add_stubs(['$setPrefixes', '$upcase', '$===', '$last_match', '$getAttackResult', '$getCriticalResult', '$==', '$<=', '$floor', '$/', '$-', '$=~', '$to_i', '$>', '$<', '$roll', '$*', '$[]', '$+', '$>=', '$debug', '$!=', '$each', '$get_wh_atpos_message', '$step', '$length', '$check_1D100', '$%', '$wh_atpos']);
  return (function($base, $super, $parent_nesting) {
    var self = $klass($base, $super, 'Warhammer');

    var $nesting = [self].concat($parent_nesting), $Warhammer_initialize$1, $Warhammer_rollDiceCommand$2, $Warhammer_check_1D100$3, $Warhammer_getCriticalResult$4, $Warhammer_wh_atpos$5, $Warhammer_get_wh_atpos_message$7, $Warhammer_getAttackResult$9;

    
    Opal.const_set($nesting[0], 'ID', "Warhammer");
    Opal.const_set($nesting[0], 'NAME', "ウォーハンマー");
    Opal.const_set($nesting[0], 'SORT_KEY', "うおおはんまあ");
    Opal.const_set($nesting[0], 'HELP_MESSAGE', "" + "・クリティカル表(whHxx/whAxx/whBxx/whLxx)\n" + "　\"WH部位 クリティカル値\"の形で指定します。部位は「H(頭部)」「A(腕)」「B(胴体)」「L(足)」の４カ所です。\n" + "　例）whH10 whA5 WHL4\n" + "・命中判定(WHx@t)\n" + "　\"WH(命中値)@(種別)\"の形で指定します。\n" + "　種別は脚の数を数字、翼が付いているものは「W」、手が付いているものは「H」で書きます。\n" + "　「2H(二足)」「2W(有翼二足)」「4(四足)」「4H(半人四足)」「4W(有翼四足)」「W(鳥類)」となります。\n" + "　命中判定を行って、当たれば部位も表示します。\n" + "　なお、種別指定を省略すると「二足」、「@」だけにすると全種別の命中部位を表示します。(コマンドを忘れた時の対応です)\n" + "　例）wh60　　wh43@4W　　WH65@\n");
    self.$setPrefixes(["WH.*"]);
    
    Opal.def(self, '$initialize', $Warhammer_initialize$1 = function $$initialize() {
      var $iter = $Warhammer_initialize$1.$$p, $yield = $iter || nil, self = this, $zuper = nil, $zuper_i = nil, $zuper_ii = nil;

      if ($iter) $Warhammer_initialize$1.$$p = null;
      // Prepare super implicit arguments
      for($zuper_i = 0, $zuper_ii = arguments.length, $zuper = new Array($zuper_ii); $zuper_i < $zuper_ii; $zuper_i++) {
        $zuper[$zuper_i] = arguments[$zuper_i];
      }
      
      $send(self, Opal.find_super_dispatcher(self, 'initialize', $Warhammer_initialize$1, false), $zuper, $iter);
      self.sendMode = 2;
      return (self.fractionType = "roundUp");
    }, $Warhammer_initialize$1.$$arity = 0);
    
    Opal.def(self, '$rollDiceCommand', $Warhammer_rollDiceCommand$2 = function $$rollDiceCommand(command) {
      var self = this, output_msg = nil, $case = nil, attackCommand = nil, criticalCommand = nil;

      
      output_msg = nil;
      $case = command.$upcase();
      if (/^(WH\d+(@[\dWH]*)?)/i['$===']($case)) {
      attackCommand = $$($nesting, 'Regexp').$last_match(1);
      output_msg = self.$getAttackResult(attackCommand);}
      else if (/^(WH[HABTLW]\d+)/i['$===']($case)) {
      criticalCommand = $$($nesting, 'Regexp').$last_match(1);
      output_msg = self.$getCriticalResult(criticalCommand);};
      return output_msg;
    }, $Warhammer_rollDiceCommand$2.$$arity = 1);
    
    Opal.def(self, '$check_1D100', $Warhammer_check_1D100$3 = function $$check_1D100(total, _dice_total, cmp_op, target) {
      var self = this;

      
      if (cmp_op['$==']("<=")) {
      } else {
        return ""
      };
      if ($truthy($rb_le(total, target))) {
        return "" + " ＞ 成功(成功度" + ($rb_divide($rb_minus(target, total), 10).$floor()) + ")"
      } else {
        return "" + " ＞ 失敗(失敗度" + ($rb_divide($rb_minus(total, target), 10).$floor()) + ")"
      };
    }, $Warhammer_check_1D100$3.$$arity = 4);
    
    Opal.def(self, '$getCriticalResult', $Warhammer_getCriticalResult$4 = function $$getCriticalResult(string) {
      var $a, $b, self = this, whh = nil, wha = nil, whb = nil, whl = nil, whw = nil, criticalTable = nil, output = nil, partsWord = nil, criticalValue = nil, whpp = nil, whppp = nil, $case = nil, dice_now = nil, crit_no = nil, crit_num = nil, resultText = nil;

      
      whh = ["01:打撃で状況が把握出来なくなる。次ターンは1回の半アクションしか行なえない。", "02:耳を強打された為、耳鳴りが酷く目眩がする。1Rに渡って一切のアクションを行なえない。", "03:打撃が頭皮を酷く傷つけた。【武器技術度】に-10%。治療を受けるまで継続。", "04:鎧が損傷し当該部位のAP-1。修理するには(職能:鎧鍛冶)テスト。鎧を着けていないなら1Rの間アクションを行なえない。", "05:転んで倒れ、頭がくらくらする。1Rに渡ってあらゆるテストに-30で、立ち上がるには起立アクションが必要。", "06:1d10R気絶。", "07:1d10分気絶。以後CTはサドンデス。", "08:顔がずたずたになって倒れ、以後無防備状態。治療を受けるまで毎Rの被害者のターン開始時に20%で死亡。以後CTはサドンデスを適用。【頑強】テストに失敗すると片方の視力を失う。", "09:凄まじい打撃により頭蓋骨が粉砕される。死は瞬時に訪れる。", "10:死亡する。いかに盛大に出血し、どのような死に様を見せたのかを説明してもよい。"];
      wha = ["01:手に握っていたものを落とす。盾はくくりつけられている為、影響なし。", "02:打撃で腕が痺れ、1Rの間使えなくなる。", "03:手の機能が失われ、治療を受けるまで回復できない。手で握っていたもの(盾を除く)は落ちる。", "04:鎧が損傷する。当該部位のAP-1。修理するには(職能:鎧鍛冶)テスト。鎧を着けていないなら腕が痺れ、1Rの間使えなくなる。", "05:腕の機能が失われ、治療を受けるまで回復できない。手で握っていたもの(盾を除く)は落ちる。", "06:腕が砕かれる。手で握っていたもの(盾を除く)は落ちる。出血がひどく、治療を受けるまで毎Rの被害者のターン開始時に20%で死亡。以後CTはサドンデスを適用。", "07:手首から先が血まみれの残骸と化す。手で握っていたもの(盾を除く)は落ちる。出血がひどく、治療を受けるまで毎Rの被害者のターン開始時に20%で死亡。以後CTはサドンデスを適用。【頑健】テストに失敗すると手の機能を失う。", "08:腕は血まみれの肉塊がぶら下がっている状態になる。手で握っていたもの(盾を除く)は落ちる。治療を受けるまで毎Rの被害者のターン開始時に20%で死亡。以後CTはサドンデスを適用。【頑健】テストに失敗すると肘から先の機能を失う。", "09:大動脈に傷が及んだ。コンマ数秒の内に損傷した肩から血を噴出して倒れる。ショックと失血により、ほぼ即死する。", "10:死亡する。いかに盛大に出血し、どのような死に様を見せたのかを説明してもよい。"];
      whb = ["01:打撃で息が詰まる。1Rの間、キャラクターの全てのテストや攻撃に-20%。", "02:股間への一撃。苦痛のあまり、1Rに渡って一切のアクションを行なえない。", "03:打撃で肋骨がぐちゃぐちゃになる。以後治療を受けるまでの間、【武器技術度】に-10%。", "04:鎧が損傷する。当該部位のAP-1。修理するには(職能:鎧鍛冶)テスト。鎧を着けていないなら股間への一撃、1Rに渡って一切のアクションを行なえない。", "05:転んで倒れ、息が詰まって悶絶する。1Rに渡ってあらゆるテストに-30の修正、立ち上がるには起立アクションが必要。", "06:1d10R気絶。", "07:ひどい内出血が起こり、無防備状態。出血がひどく、治療を受けるまで毎Rの被害者のターン開始時に20%で死亡。", "08:脊髄が粉砕されて倒れ、以後治療を受けるまで無防備状態。以後CTはサドンデスを適用。【頑強】テストに失敗すると腰から下が不随になる。", "09:凄まじい打撃により複数の臓器が破裂し、死は数秒のうちに訪れる。", "10:死亡する。いかに盛大に出血し、どのような死に様を見せたのかを説明してもよい。"];
      whl = ["01:よろめく。次のターン、1回の半アクションしか行なえない。", "02:脚が痺れる。1Rに渡って【移動】は半減し、脚に関連する【敏捷】テストに-20%。回避が出来なくなる。", "03:脚の機能が失われ、治療を受けるまで回復しない。【移動】は半減し、脚に関連する【敏捷】テストに-20%。回避が出来なくなる。", "04:鎧が損傷する。当該部位のAP-1。修理するには(職能:鎧鍛冶)テスト。鎧を着けていないなら脚が痺れる、1Rに渡って【移動】は半減し、脚に関連する【敏捷】テストに-20%、回避不可になる。", "05:転んで倒れ、頭がくらくらする。1Rに渡ってあらゆるテストに-30の修正、立ち上がるには起立アクションが必要。", "06:脚が砕かれ、無防備状態。出血がひどく、治療を受けるまで毎Rの被害者のターン開始時に20%で死亡。以後CTはサドンデスを適用。", "07:脚は血まみれの残骸と化し、無防備状態になる。治療を受けるまで毎Rの被害者のターン開始時に20%で死亡。以後CTはサドンデスを適用。【頑強】テストに失敗すると足首から先を失う。", "08:脚は血まみれの肉塊がぶらさがっている状態。以後無防備状態。治療を受けるまで毎Rの被害者のターン開始時に20%で死亡。以後CTはサドンデスを適用。【頑強】テストに失敗すると膝から下を失う。", "09:大動脈に傷が及ぶ。コンマ数秒の内に脚の残骸から血を噴出して倒れ、ショックと出血で死は瞬時に訪れる。", "10:死亡する。いかに盛大に出血し、どのような死に様を見せたのかを説明してもよい。"];
      whw = ["01:軽打。1ラウンドに渡って、あらゆるテストに-10％。", "02:かすり傷。+10％の【敏捷】テストを行い、失敗なら直ちに高度を1段階失う。地上にいるクリーチャーは、次のターンには飛び立てない。", "03:損傷する。【飛行移動力】が2点低下する。-10％の【敏捷】テストを行い、失敗なら直ちに高度を1段階失う。地上にいるクリーチャーは、次のターンには飛び立てない。", "04:酷く損傷する。【飛行移動力】が4点低下する。-30％の【敏捷】テストを行い、失敗なら直ちに高度を1段階失う。地上にいるクリーチャーは、1d10ターンが経過するまで飛び立てない。", "05:翼が使えなくなる。【飛行移動力】が0に低下する。飛行中のものは落下し、高度に応じたダメージを受ける。地上にいるクリーチャーは、怪我が癒えるまで飛び立てない。", "06:翼の付け根に傷が開く。【飛行移動力】が0に低下する。飛行中のものは落下し、高度に応じたダメージを受ける。地上にいるクリーチャーは、怪我が癒えるまで飛び立てない。治療を受けるまで毎R被害者のターン開始時に20％の確率で死亡。以後CTはサドンデスを適用。", "07:翼は血まみれの残骸と化し、無防備状態になる。【飛行移動力】が0に低下する。飛行中のものは落下し、高度に応じたダメージを受ける。地上にいるクリーチャーは、怪我が癒えるまで飛び立てない。治療を受けるまで毎R被害者のターン開始時に20％の確率で死亡。以後CTはサドンデスを適用。【頑強】テストに失敗すると飛行能力を失う。", "08:翼が千切れてバラバラになり、無防備状態になる。【飛行移動力】が0に低下する。飛行中のものは落下し、高度に応じたダメージを受ける。地上にいるクリーチャーは、怪我が癒えるまで飛び立てない。治療を受けるまで毎R被害者のターン開始時に20％の確率で死亡。以後CTはサドンデスを適用。飛行能力を失う。", "09:大動脈が切断された。コンマ数秒の内に血を噴き上げてくずおれる、ショックと出血で死は瞬時に訪れる。", "10:死亡する。いかに盛大に出血し、どのような死に様を見せたのかを説明してもよい。"];
      criticalTable = [5, 7, 9, 10, 10, 10, 10, 10, 10, 10, 5, 6, 8, 9, 10, 10, 10, 10, 10, 10, 4, 6, 8, 9, 9, 10, 10, 10, 10, 10, 4, 5, 7, 8, 9, 9, 10, 10, 10, 10, 3, 5, 7, 8, 8, 9, 9, 10, 10, 10, 3, 4, 6, 7, 8, 8, 9, 9, 10, 10, 2, 4, 6, 7, 7, 8, 8, 9, 9, 10, 2, 3, 5, 6, 7, 7, 8, 8, 9, 9, 1, 3, 5, 6, 6, 7, 7, 8, 8, 9, 1, 2, 4, 5, 6, 6, 7, 7, 8, 8];
      output = "1";
      if ($truthy(/WH([HABTLW])(\d+)/['$=~'](string))) {
      } else {
        return "1"
      };
      partsWord = $$($nesting, 'Regexp').$last_match(1);
      criticalValue = $$($nesting, 'Regexp').$last_match(2).$to_i();
      if ($truthy($rb_gt(criticalValue, 10))) {
        criticalValue = 10};
      if ($truthy($rb_lt(criticalValue, 1))) {
        criticalValue = 1};
      whpp = "";
      whppp = "";
      $case = partsWord;
      if (/H/i['$===']($case)) {
      whpp = "頭部";
      whppp = whh;}
      else if (/A/i['$===']($case)) {
      whpp = "腕部";
      whppp = wha;}
      else if (/[TB]/i['$===']($case)) {
      whpp = "胴体";
      whppp = whb;}
      else if (/L/i['$===']($case)) {
      whpp = "脚部";
      whppp = whl;}
      else if (/W/i['$===']($case)) {
      whpp = "翼部";
      whppp = whw;};
      $b = self.$roll(1, 100), $a = Opal.to_ary($b), (dice_now = ($a[0] == null ? nil : $a[0])), $b;
      crit_no = $rb_times($rb_divide($rb_minus(dice_now, 1), 10).$to_i(), 10);
      crit_num = criticalTable['$[]']($rb_minus($rb_plus(crit_no, criticalValue), 1));
      resultText = whppp['$[]']($rb_minus(crit_num, 1));
      if ($truthy($rb_ge(crit_num, 5))) {
        resultText = $rb_plus(resultText, "サドンデス×")
      } else {
        resultText = $rb_plus(resultText, "サドンデス○")
      };
      output = "" + (whpp) + "CT表(" + (dice_now) + "+" + (criticalValue) + ") ＞ " + (resultText);
      return output;
    }, $Warhammer_getCriticalResult$4.$$arity = 1);
    
    Opal.def(self, '$wh_atpos', $Warhammer_wh_atpos$5 = function $$wh_atpos(pos_num, pos_type) {
      var $$6, self = this, pos_2l = nil, pos_2lw = nil, pos_4l = nil, pos_4la = nil, pos_4lw = nil, pos_b = nil, wh_pos = nil, pos_t = nil, $case = nil, output = nil, pos_i = nil;

      
      self.$debug("wh_atpos begin pos_type", pos_type);
      pos_2l = ["二足", 15, "頭部", 35, "右腕", 55, "左腕", 80, "胴体", 90, "右脚", 100, "左脚"];
      pos_2lw = ["有翼二足", 15, "頭部", 25, "右腕", 35, "左腕", 45, "右翼", 55, "左翼", 80, "胴体", 90, "右脚", 100, "左脚"];
      pos_4l = ["四足", 15, "頭部", 60, "胴体", 70, "右前脚", 80, "左前脚", 90, "右後脚", 100, "左後脚"];
      pos_4la = ["半人四足", 10, "頭部", 20, "右腕", 30, "左腕", 60, "胴体", 70, "右前脚", 80, "左前脚", 90, "右後脚", 100, "左後脚"];
      pos_4lw = ["有翼四足", 10, "頭部", 20, "右翼", 30, "左翼", 60, "胴体", 70, "右前脚", 80, "左前脚", 90, "右後脚", 100, "左後脚"];
      pos_b = ["鳥", 15, "頭部", 35, "右翼", 55, "左翼", 80, "胴体", 90, "右脚", 100, "左脚"];
      wh_pos = [pos_2l, pos_2lw, pos_4l, pos_4la, pos_4lw, pos_b];
      pos_t = 0;
      self.$debug("pos_type", pos_type);
      if ($truthy(pos_type['$!='](""))) {
        $case = pos_type;
        if (/\@(2W|W2)/i['$===']($case)) {pos_t = 1}
        else if (/\@(4W|W4)/i['$===']($case)) {pos_t = 4}
        else if (/\@(4H|H4)/i['$===']($case)) {pos_t = 3}
        else if (/\@4/i['$===']($case)) {pos_t = 2}
        else if (/\@W/i['$===']($case)) {pos_t = 5}
        else {if ($truthy(/\@(2H|H2|2)/i['$=~'](pos_type))) {
        } else {
          pos_t = -1
        }}};
      output = "";
      self.$debug("pos_t", pos_t);
      if ($truthy($rb_lt(pos_t, 0))) {
        $send(wh_pos, 'each', [], ($$6 = function(pos_i){var self = $$6.$$s || this;

        
          
          if (pos_i == null) {
            pos_i = nil;
          };
          return (output = $rb_plus(output, self.$get_wh_atpos_message(pos_i, pos_num)));}, $$6.$$s = self, $$6.$$arity = 1, $$6))
      } else {
        
        pos_i = wh_pos['$[]'](pos_t);
        output = $rb_plus(output, self.$get_wh_atpos_message(pos_i, pos_num));
      };
      return output;
    }, $Warhammer_wh_atpos$5.$$arity = 2);
    
    Opal.def(self, '$get_wh_atpos_message', $Warhammer_get_wh_atpos_message$7 = function $$get_wh_atpos_message(pos_i, pos_num) {
      var $$8, self = this, output = nil;

      
      output = "";
      output = $rb_plus(output, $rb_plus($rb_plus(" ", pos_i['$[]'](0)), ":"));
      (function(){var $brk = Opal.new_brk(); try {return $send((1), 'step', [$rb_plus(pos_i.$length(), 1), 2], ($$8 = function(i){var self = $$8.$$s || this;

      
        
        if (i == null) {
          i = nil;
        };
        if ($truthy($rb_le(pos_num, pos_i['$[]'](i)))) {
          
          output = $rb_plus(output, pos_i['$[]']($rb_plus(i, 1)));
          
          Opal.brk(nil, $brk);
        } else {
          return nil
        };}, $$8.$$s = self, $$8.$$brk = $brk, $$8.$$arity = 1, $$8))
      } catch (err) { if (err === $brk) { return err.$v } else { throw err } }})();
      return output;
    }, $Warhammer_get_wh_atpos_message$7.$$arity = 2);
    return (Opal.def(self, '$getAttackResult', $Warhammer_getAttackResult$9 = function $$getAttackResult(string) {
      var $a, $b, self = this, pos_type = nil, diff = nil, total_n = nil, output = nil, pos_num = nil;

      
      self.$debug("getAttackResult begin string", string);
      pos_type = "";
      if ($truthy(/(.+)(@.*)/['$=~'](string))) {
        
        string = $$($nesting, 'Regexp').$last_match(1);
        pos_type = $$($nesting, 'Regexp').$last_match(2);
        self.$debug("pos_type", pos_type);};
      if ($truthy(/WH(\d+)/i['$=~'](string))) {
      } else {
        return "1"
      };
      diff = $$($nesting, 'Regexp').$last_match(1).$to_i();
      $b = self.$roll(1, 100), $a = Opal.to_ary($b), (total_n = ($a[0] == null ? nil : $a[0])), $b;
      output = "" + "(" + (string) + ") ＞ " + (total_n);
      output = $rb_plus(output, self.$check_1D100(total_n, total_n, "<=", diff));
      pos_num = $rb_plus($rb_times(total_n['$%'](10), 10), $rb_divide(total_n, 10).$to_i());
      if ($truthy($rb_ge(total_n, 100))) {
        pos_num = 100};
      if ($truthy($rb_le(total_n, diff))) {
        output = $rb_plus(output, self.$wh_atpos(pos_num, pos_type))};
      return output;
    }, $Warhammer_getAttackResult$9.$$arity = 1), nil) && 'getAttackResult';
  })($nesting[0], $$($nesting, 'DiceBot'), $nesting)
})(Opal);
