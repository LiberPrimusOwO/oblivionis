const PHYSICS_PAPERS = (() => {
  const t=String.raw;
  const p=text=>({type:'paragraph',text});
  const m=tex=>({type:'math',tex});
  const fig=(id,alt)=>({type:'figure',id,alt});
  const q=(label,text,extra=[])=>({type:'question',label,blocks:[p(text),...extra]});
  const section=(label,blocks,answers)=>({label,blocks,answers});
  return [{
    id:'tokyo-2026-physics',
    title:'2026 东京大学（前期）物理',
    subtitle:'物理基础 / 物理',
    source:'东京大学（前期）2026',
    directory:'./physics--tokyo-2026--',
    problems:[{
      number:1,
      topic:'刚性杆的运动',
      introduction:[
        p(t`考察独轮车在路面上行驶时的运动。如图 1—1 所示，将独轮车及骑乘者建模为一根一端装有内置动力车轮的刚性杆。该刚性杆的粗细和密度均匀，长度、质量分别为 $L$、$m$。车轮的大小与质量可以忽略。这里，设车轮与路面之间的摩擦力仅为静摩擦力，其静摩擦系数为 $\mu$。当这根带车轮的刚性杆在不滑动的状态下运动时，它通过车轮与路面之间的摩擦力加速或减速。重力加速度的大小为 $g$。可以忽略空气阻力。`),
        fig('1-1','图 1—1：带动力车轮的刚性杆在水平路面上加速，标出了杆长、重力方向和静摩擦力方向。')
      ],
      sections:[
        section('Ⅰ',[
          q('',t`首先，考虑刚性杆在水平面上做匀加速直线运动的情况。如图 1—1 所示，当刚性杆沿前进方向加速时，求车轮与路面之间不发生滑动时所能达到的最大加速度大小。`)
        ],[m(t`a_{\max}=\mu g`)]),
        section('Ⅱ',[
          p(t`接下来，考虑刚性杆如图 1—2 所示，在水平路面上做圆周运动的情况。图 1—3 是从前进方向的正后方观察图 1—2 中刚性杆所得的图。设圆周运动的中心轴到车轮与路面接触点的水平距离为 $R$。这里，$L\ll R$，可以忽略刚性杆倾斜引起的重心圆周运动轨道半径的变化。此外，为简化问题，不考虑刚性杆沿前进方向的倾斜。`),
          fig('1-2','图 1—2：刚性杆在水平圆形路面上沿半径 R 的轨道运动。'),
          fig('1-3','图 1—3：从正后方观察刚性杆，杆与水平面的夹角为 θ。'),
          q('(1)',t`在图 1—3 中，设刚性杆与水平面的夹角为 $\theta$。当刚性杆以速率 $v_0$ 做匀速圆周运动时，求 $\tan\theta$，用 $v_0$、$R$、$g$ 中必要的量表示。`),
          q('(2)',t`在上一问Ⅱ(1)中，设刚性杆在不滑动的情况下做匀速圆周运动所能达到的最大速率为 $v_1$。求 $v_1$。`),
          q('(3)',t`刚性杆最初以速率 $v_0\,(<v_1)$ 做匀速圆周运动，保持半径 $R$ 不变，使其沿前进方向以大小恒为 $a$ 的加速度，在极短的时间内加速。求此时车轮与路面之间的静摩擦力大小。设车轮与路面之间没有发生滑动。`),
          q('(4)',t`在上一问Ⅱ(3)中，求刚性杆能够在不滑动的情况下加速时，$a$ 的最大值。`)
        ],[
          p('(1)'),m(t`\tan\theta=\frac{gR}{v_0^2}`),
          p('(2)'),m(t`v_1=\sqrt{\mu gR}`),
          p('(3)'),m(t`f=\sqrt{\left(\frac{mv_0^2}{R}\right)^2+(ma)^2}`),
          p('(4)'),m(t`a_{\max}=\sqrt{(\mu g)^2-\left(\frac{v_0^2}{R}\right)^2}`)
        ]),
        section('Ⅲ',[
          p(t`最后，考虑刚性杆如图 1—4 所示，在碗状路面上做圆周运动的情况。图 1—5 是从前进方向的正后方观察图 1—4 中刚性杆所得的图。设路面与水平面的夹角为 $\phi\,(0<\phi<\frac{\pi}{2})$。与第Ⅱ部分相同，设圆周运动的中心轴到刚性杆与路面接触点的水平距离为 $R$。$L\ll R$，可以忽略刚性杆倾斜引起的重心圆周运动轨道半径的变化。此外，为简化问题，不考虑刚性杆沿前进方向的倾斜。`),
          fig('1-4','图 1—4：刚性杆在碗状路面上做圆周运动。'),
          fig('1-5','图 1—5：路面与水平面的夹角为 φ，刚性杆与水平面的夹角为 θ。'),
          q('(1)',t`在图 1—5 中，设刚性杆与水平面的夹角为 $\theta$。当刚性杆以速率 $v_0$ 做匀速圆周运动时，求 $\tan\theta$，用 $v_0$、$R$、$g$、$\phi$ 中必要的量表示。`),
          q('(2)',t`设刚性杆在不滑动的情况下做匀速圆周运动所能达到的最大速率为 $v_2$。求 $v_2$。其中，$\tan\phi<\frac{1}{\mu}$。`),
          q('(3)',t`高速公路的弯道和自行车竞速赛道通常设有外侧较高的倾斜路面。请根据Ⅱ(2)及Ⅲ(2)的结果，简要说明这样设计的原因。`)
        ],[
          p('(1)'),m(t`\tan\theta=\frac{gR}{v_0^2}`),
          p('(2)'),m(t`v_2=\sqrt{\frac{\mu+\tan\phi}{1-\mu\tan\phi}\,gR}`),
          p(t`(3) 在题设条件下，$v_2>v_1$。外侧较高的倾斜路面使车辆能够在不滑动的情况下，以更大的速率做圆周运动。`)
        ])
      ]
    },{
      number:2,
      topic:'转动导体棒与电路',
      introduction:[
        p(t`考虑如图 2—1 所示、含有在圆形导轨上转动的导体棒的电路。由导体制成的圆形导轨半径为 $l$，放置在水平面上，其圆心处装有可导电的转轴。导轨与转轴上架着一根具有质量的导体棒。导体棒的一端由转轴支撑，另一端始终与圆形导轨接触，并可在水平面内转动。圆形导轨和转轴分别通过接线端 P 和 O 与电阻、转换开关等相连。电阻的阻值为 $R$。圆形导轨所围的区域内存在磁感应强度为 $B$、方向竖直向上（垂直纸面向外）的匀强磁场。忽略圆形导轨的粗细和转轴的大小。导体棒不发生形变，并且只与圆形导轨和转轴接触。摩擦、空气阻力、圆形导轨和导体棒的电阻及接触电阻，以及电路中电流产生的磁场的影响，均可忽略。`),
        fig('2-1','图 2—1：转动导体棒、电阻、直流电源和电容器 1 构成的电路；开关可接 X 或 Y，导体棒的两个转向标为甲、乙。')
      ],
      sections:[
        section('Ⅰ',[
          q('',t`保持开关断开，使导体棒以恒定角速度 $\omega_1$ 转动，接线端 O 与接线端 P 之间产生了电动势 $E_1$。引入系数 $\alpha$，该电动势可表示为 $E_1=\alpha\omega_1$。考虑极短时间内导体棒扫过的区域中的磁通量，用 $l$、$B$ 表示系数 $\alpha$，不必注明正负号。`)
        ],[m(t`\alpha=\frac{1}{2}Bl^2`)]),
        section('Ⅱ',[
          p(t`使导体棒重新静止，再将开关接到接线端 X，接通电压为 $V$ 的直流电源。直流电源的内阻可以忽略。`),
          q('(1)',t`用 $V$、$l$、$B$、$R$ 表示开关刚接到接线端 X 时，导体棒所受力相对于转轴的力矩大小，不必注明正负号。设导体棒的粗细恒定、密度均匀。`),
          q('(2)',t`随后，导体棒开始绕转轴转动。请判断其转动方向是图 2—1 中的（甲）还是（乙）。`),
          q('(3)',t`经过足够长的时间后，导体棒以恒定角速度 $\omega_2$ 持续转动。求角速度 $\omega_2$ 的大小，用 $V$、$\alpha$、$l$、$B$、$R$ 中必要的量表示，不必注明正负号。`)
        ],[
          p('(1)'),m(t`\tau=\frac{VBl^2}{2R}`),
          p('(2) 甲。'),
          p('(3)'),m(t`\omega_2=\frac{V}{\alpha}=\frac{2V}{Bl^2}`)
        ]),
        section('Ⅲ',[
          q('',t`在导体棒如Ⅱ(3)所述以角速度 $\omega_2$ 转动时，将开关切换到接线端 Y，接通电容为 $C_1$ 的电容器 1。导体棒的转动逐渐减慢，经过足够长的时间后，以恒定角速度 $\omega_3$ 持续转动。求此时电容器 1 储存的能量，用 $\omega_3$、$\alpha$、$l$、$B$、$C_1$ 中必要的量表示。其中，电容器 1 最初不带电。`)
        ],[m(t`U_1=\frac{1}{2}C_1(\alpha\omega_3)^2=\frac{1}{8}C_1(Bl^2\omega_3)^2`)]),
        section('Ⅳ',[
          p(t`第Ⅱ、Ⅲ部分操作的结果，也可以通过将接线端 O—P 之间的部分视为图 2—2 所示的虚拟电容器（电容器 2）来理解。电容器 2 具有与实际电容器相同的性质。也就是说，接线端之间的电压 $V_2$、虚拟电容 $C_2$ 与虚拟电荷量 $Q_2$ 之间的关系，以及所储存的静电能，均可用与实际电容器相同的公式表示。`),
          fig('2-2','图 2—2：将转动导体棒等效为虚拟电容器 2 后的电路。'),
          q('(1)',t`物体转动时具有由转动产生的动能。当导体棒以恒定角速度 $\omega$ 转动时，引入常数 $\beta$，其动能可以表示为 $\frac{1}{2}\beta\omega^2$。若将等量的能量解释为电容器 2 所储存的静电能，求 $Q_2$ 和 $C_2$，分别用 $\omega$、$\alpha$、$\beta$ 表示。`),
          q('(2)',t`对图 2—2 进行与第Ⅱ、Ⅲ部分相同的操作。即先将开关接到接线端 X，经过足够长的时间后，再将开关切换到接线端 Y，继续等待足够长的时间。求这一操作结束后电容器 1 储存的能量，用 $V$、$C_1$、$C_2$ 表示。其中，开关切换到接线端 Y 后，可以认为电容器 1 与电容器 2 所储存的电荷量之和保持不变。`),
          q('(3)',t`根据第Ⅲ部分和Ⅳ(2)的结果，用 $V$、$\alpha$、$C_1$、$C_2$ 表示第Ⅲ部分中的 $\omega_3$。`)
        ],[
          p('(1)'),m(t`Q_2=\frac{\beta\omega}{\alpha},\qquad C_2=\frac{\beta}{\alpha^2}`),
          p('(2)'),m(t`U_1=\frac{C_1C_2^2V^2}{2(C_1+C_2)^2}`),
          p('(3)'),m(t`\omega_3=\frac{C_2V}{\alpha(C_1+C_2)}`)
        ])
      ]
    },{
      number:3,
      topic:'透镜成像与波动光学',
      introduction:[p('考虑利用透镜将物体的实像投影到光屏上。其中，透镜的厚度可以忽略。')],
      sections:[
        section('Ⅰ',[
          p(t`这里用光线描述光的传播。如图 3—1 所示，使用焦距为 $d$ 的凸透镜 $\mathrm{L}_1$，将距离为 $D$（$D\gg d$）、高度为 $H$ 的物体 A 的像投影到光屏 S 上，其中 $D$ 远大于 $d$。`),
          fig('3-1','图 3—1：远处高度为 H 的物体 A，通过焦距为 d 的凸透镜 L1 在光屏 S 上成像。'),
          q('(1)',t`要在光屏上投影出清晰的像，只需使透镜 $\mathrm{L}_1$ 与光屏 S 之间的距离等于透镜的焦距 $d$。请用表示物体、实像和透镜三者位置关系的透镜成像公式，简要说明这一点。`),
          q('(2)',t`下文描述了这一成像过程。请从下表的 (a)～(f) 中，选出填入空白处（甲）、（乙）的表达式与词语的最恰当组合。`,[
            p(t`注意到，从足够远处的物体 A 发出的光中，穿过透镜 $\mathrm{L}_1$ 中心的光沿直线传播，可知光屏 S 上像的高度 $h$ 为 $h=$（甲）。由此可知，要使物体在光屏上成的像更大，应当使用焦距更（乙）的透镜。`),
            {type:'table',headers:['选项','甲','乙'],rows:[['(a)',t`$\dfrac{Hd}{D}$`,'短'],['(b)',t`$\dfrac{Hd}{D}$`,'长'],['(c)',t`$\dfrac{HD}{d}$`,'短'],['(d)',t`$\dfrac{HD}{d}$`,'长'],['(e)',t`$\dfrac{Dd}{H}$`,'短'],['(f)',t`$\dfrac{Dd}{H}$`,'长']]}
          ]),
          p(t`下面考察实际照相机中的长焦镜头（将足够远处物体的像放大投影的镜头）的结构。图 3—2 表示用凸透镜 $\mathrm{L}_2$ 和凹透镜 $\mathrm{L}_3$，将放置在图中右侧足够远处的物体的清晰像投影到光屏 S 上的情形。凸透镜 $\mathrm{L}_2$ 的焦距为 $5d$，各透镜与光屏之间的距离如图 3—2 所示。`),
          fig('3-2','图 3—2：凸透镜 L2 与凹透镜 L3 相距 4d，L3 与光屏相距 3d，标出了光线甲和焦点 P1、P2。'),
          q('(3)',t`关注平行于光轴、与光轴相距 $w$ 并射入 $\mathrm{L}_2$ 的光线（甲）。这条光线经 $\mathrm{L}_2$ 折射后朝其焦点 $\mathrm{P}_1$ 传播，但途中又被 $\mathrm{L}_3$ 折射，并在光屏 S 上的 $\mathrm{P}_2$ 点与光轴相交。求透镜 $\mathrm{L}_3$ 的焦距，用 $d$ 表示。此外，设这条光线到达光屏时与光轴的夹角为 $\alpha$，求 $\tan\alpha$，用 $d$、$w$ 表示。`),
          q('(4)',t`将图 3—2 中由透镜 $\mathrm{L}_2$ 和 $\mathrm{L}_3$ 组成的透镜组，替换为放置在适当位置的一枚凸透镜，使上一问Ⅰ(3)中所关注的光线（甲）以与光轴成 $\alpha$ 角的方向通过点 $\mathrm{P}_2$。此时，求这枚凸透镜的焦距，用 $d$ 表示。`),
          q('(5)',t`实际使用的长焦镜头常采用图 3—2 所示的透镜结构。与使用单枚凸透镜的情况相比，请简要说明这种结构的优点。`)
        ],[
          p(t`(1) 设物距为 $D$，像距为 $b$，由透镜成像公式`),m(t`\frac{1}{D}+\frac{1}{b}=\frac{1}{d}`),p(t`由于 $D\gg d$，可忽略 $1/D$，因此 $b\simeq d$。`),
          p(t`(2) 选 (b)。$h=\dfrac{Hd}{D}$；应使用焦距更长的透镜。`),
          p(t`(3) 凹透镜的焦距大小为 $\dfrac{3d}{2}$，按有符号焦距记为 $f_3=-\dfrac{3d}{2}$。`),m(t`\tan\alpha=\frac{w}{15d}`),
          p('(4)'),m(t`f'=15d`),
          p('(5) 与单枚凸透镜相比，透镜组可以缩短透镜与光屏之间的距离，使长焦镜头更紧凑。')
        ]),
        section('Ⅱ',[
          p(t`第Ⅰ部分用光线表示光的传播方式，但光实际上是一种波。因此，即使用透镜将物体上一点发出的单色光投影成像，像仍会略微模糊（产生弥散斑）。设光的波长为 $\lambda$，下面考察这一弥散斑的大小。如图 3—3 所示，考虑用一枚凸透镜 L，将足够远处物体的像投影到光屏 S 上的情况。透镜 L 的半径为 $R$，焦距为 $d$。如图所示，足够远处的物体上、位于光轴上的一点发出的光，以平面波的形式射入 L，通过 L 后变为球面波，并会聚到焦点 O。刚通过 L 后的波面 W，可视为以焦点 O 为球心、半径为 $d$ 的球面。取焦点 O 为原点，光轴为 $x$ 轴，沿光屏取 $y$ 轴。以下，当 $|\varepsilon|\ll1$ 时，可使用近似公式`),
          m(t`\sqrt{1+\varepsilon}\simeq1+\frac{\varepsilon}{2}`),
          fig('3-3','图 3—3：平面波经透镜 L 变为球面波；标出了波面 W、W1、W2、焦点 O、点 Q、半径 R 和夹角 β。'),
          q('(1)',t`如图 3—3 所示，波面 W 上所有点到焦点 O 的距离都相等。因此，透过透镜的光均以相同的相位到达焦点 O，使点 O 变亮。而在焦点 O 附近的位置 $\mathrm{Q}(x,y)$，各束光到达时的相位则不同。设波面 W 上靠近透镜边缘的点 $\mathrm{W}_2(d\cos\beta,d\sin\beta)$ 到 Q 的距离为 $\overline{\mathrm{W}_2\mathrm{Q}}$，透镜中央附近的点 $\mathrm{W}_1(d,0)$ 到 Q 的距离为 $\overline{\mathrm{W}_1\mathrm{Q}}$。其中，$\beta$ 为直线 $\mathrm{OW}_2$ 与光轴的夹角。求光程差 $\Delta L=\overline{\mathrm{W}_2\mathrm{Q}}-\overline{\mathrm{W}_1\mathrm{Q}}$，仅用 $x$、$y$、$\beta$ 表示，不使用 $d$。设 $\tan\beta=R/d$，且 $|x|,|y|\ll d$。`),
          q('(2)',t`设点 $\mathrm{Q}(0,y)$ 位于光屏上。当上一问Ⅱ(1)求得的光程差等于光的半波长 $\lambda/2$ 时，点 Q 的 $y$ 坐标值即为光屏上像的弥散斑大小。求这一弥散斑的大小，用 $\beta$、$\lambda$ 表示。`),
          q('(3)',t`在上一问Ⅱ(2)中，当 $d=12\,\mathrm{cm}$、$R=5.0\,\mathrm{cm}$、$\lambda=5.0\times10^{-7}\,\mathrm{m}$ 时，求弥散斑的大小。此外，当物体与透镜之间的距离为 $D=1.2\times10^2\,\mathrm{m}$ 时，求光屏上的这一弥散斑大小对应于物体上多大的尺寸。`),
          q('(4)',t`将光屏从焦点 O 沿光轴向透镜 L 移动，考察仍能使物体成像基本清晰的光屏位置允许范围。设这一允许范围为：点 Q 沿 $x$ 轴移动时，Ⅱ(1)中求得的光程差 $\Delta L$ 尚未超过光的半波长 $\lambda/2$ 的范围。设点 Q 的坐标为 $\mathrm{Q}(x,0)$，求给出这一允许范围边界的 $x$ 值，用 $\beta$、$\lambda$ 表示。`)
        ],[
          p('(1)'),m(t`\Delta L\simeq x(1-\cos\beta)-y\sin\beta`),
          p('(2)'),m(t`|y|=\frac{\lambda}{2\sin\beta}`),
          p(t`(3) 由 $\tan\beta=5/12$ 得 $\sin\beta=5/13$。弥散斑的大小为`),m(t`6.5\times10^{-7}\,\mathrm{m}`),p('对应于物体上的尺寸为'),m(t`6.5\times10^{-4}\,\mathrm{m}`),
          p('(4)'),m(t`x=\frac{\lambda}{2(1-\cos\beta)}`)
        ])
      ]
    }]
  }];
})();

const PHYSICS_IMAGES={"1-1": {"file": "figure-1-1.webp", "width": 926, "height": 949}, "1-2": {"file": "figure-1-2.webp", "width": 922, "height": 768}, "1-3": {"file": "figure-1-3.webp", "width": 2247, "height": 1788}, "1-4": {"file": "figure-1-4.webp", "width": 922, "height": 778}, "1-5": {"file": "figure-1-5.webp", "width": 2409, "height": 1684}, "2-1": {"file": "figure-2-1.webp", "width": 1524, "height": 920}, "2-2": {"file": "figure-2-2.webp", "width": 5743, "height": 3743}, "3-1": {"file": "figure-3-1.svg", "width": 354.0, "height": 120.5}, "3-2": {"file": "figure-3-2.svg", "width": 384.5, "height": 159.0}, "3-3": {"file": "figure-3-3.svg", "width": 231.0, "height": 148.5}};

PHYSICS_PAPERS.push({"id": "textbook-physics-exercises", "title": "课本习题集", "subtitle": "课本习题集", "source": "第1章 力学 / 第1节 运动方程与匀变速运动", "directory": "./", "problems": [{"number": 1, "topic": "基础练习 / 列车的匀变速运动", "introduction": [{"type": "paragraph", "text": "一列原本静止的列车，以恒定加速度 $\\alpha>0$ 开始运动。当速度达到 $v$ 后，保持匀速运动一段时间，随后以恒定加速度 $-\\beta$（$\\beta>0$）减速，直至再次静止。列车沿直线运动，总路程为 $l$。"}], "sections": [{"label": "题目", "blocks": [{"type": "paragraph", "text": "求列车运动的总时间，并在 $\\alpha$、$\\beta$、$l$ 均为常量时，求使总时间最短的速度 $v$。"}], "answers": [{"type": "paragraph", "text": "总时间："}, {"type": "math", "tex": "t=\\frac{\\alpha+\\beta}{2\\alpha\\beta}v+\\frac{l}{v}"}, {"type": "paragraph", "text": "使总时间最短的速度："}, {"type": "math", "tex": "v=\\sqrt{\\frac{2\\alpha\\beta l}{\\alpha+\\beta}}"}]}]}, {"number": 2, "topic": "基础练习 / 斜面上的斜抛运动", "introduction": [{"type": "paragraph", "text": "从一个与水平面夹角为 $\\alpha$ 的斜面顶端，向斜面下方，以与水平方向成向上 $\\theta$ 角、初速度大小为 $v_0$ 的方式抛出一个小球。"}, {"type": "figure", "id": "textbook-projectile", "alt": "小球从斜面顶端以仰角 θ 抛出后落在斜面上，斜面倾角为 α。"}], "sections": [{"label": "题目", "blocks": [{"type": "paragraph", "text": "求小球从抛出到落在斜面上所经历的时间，以及小球从抛出点到落点沿斜面的距离。重力加速度大小为 $g$。"}], "answers": [{"type": "paragraph", "text": "运动时间："}, {"type": "math", "tex": "t=\\frac{2v_0\\sin(\\theta+\\alpha)}{g\\cos\\alpha}"}, {"type": "paragraph", "text": "沿斜面的距离："}, {"type": "math", "tex": "l=\\frac{2v_0^2\\cos\\theta\\sin(\\theta+\\alpha)}{g\\cos^2\\alpha}"}]}]}, {"number": 3, "topic": "基础练习 / 加速电梯中的小石块", "introduction": [{"type": "paragraph", "text": "一部原本静止于地面的电梯，从 $t=0$ 时刻开始，以恒定加速度 $a$ 竖直向上运动。重力加速度大小为 $g$。"}, {"type": "figure", "id": "textbook-elevator", "alt": "电梯沿竖直方向向上加速，小石块放在电梯地板上的台秤上。"}], "sections": [{"label": "（1）", "blocks": [{"type": "paragraph", "text": "将质量为 $m$ 的小石块放在电梯地板上的上皿式台秤上。秤的指针略微摆动后静止。求秤的示数。"}], "answers": [{"type": "paragraph", "text": "台秤示数（质量刻度）："}, {"type": "math", "tex": "m'=m\\left(1+\\frac{a}{g}\\right)"}]}, {"label": "（2）", "blocks": [{"type": "paragraph", "text": "在 $t=t_1>0$ 时刻，从电梯地板处，以相对于电梯竖直向上的初速度 $v_0$ 抛出小石块。假设小石块不会撞到电梯天花板，求小石块距离电梯地板最远的时刻，以及此时小石块相对于电梯地板的高度。"}], "answers": [{"type": "paragraph", "text": "距离地板最远的时刻："}, {"type": "math", "tex": "t=t_1+\\frac{v_0}{a+g}"}, {"type": "paragraph", "text": "最大高度："}, {"type": "math", "tex": "h_{\\max}=\\frac{v_0^2}{2(a+g)}"}]}]}, {"number": 4, "topic": "实战练习 1 / 台车与重物的摩擦运动", "introduction": [{"type": "paragraph", "text": "在水平地面上有一辆质量为 $m_1$ 的台车，它可以无阻碍地运动。台车上放有一个质量为 $m_2$ 的重物。用一根与重物连接的绳子拉动重物，使台车沿水平直线运动。"}, {"type": "paragraph", "text": "设绳子的张力为 $T$，绳子与水平地面的夹角为 $\\theta$，重力加速度为 $g$，其中 $\\theta$ 为已知量。"}, {"type": "figure", "id": "textbook-cart", "alt": "绳子以与水平方向夹角 θ 拉动台车上的重物，台车与重物的质量分别为 m₁、m₂。"}], "sections": [{"label": "（1）", "blocks": [{"type": "paragraph", "text": "求重物受到台车的支持力。"}], "answers": [{"type": "math", "tex": "N=m_2g-T\\sin\\theta"}]}, {"label": "（2）", "blocks": [{"type": "paragraph", "text": "设重物与台车之间的摩擦力大小为 $f$，台车与重物的水平加速度分别为 $a_1$、$a_2$。分别写出它们的水平方向运动方程。"}], "answers": [{"type": "math", "tex": "m_1a_1=f"}, {"type": "math", "tex": "m_2a_2=T\\cos\\theta-f"}]}, {"label": "（3）", "blocks": [{"type": "paragraph", "text": "当重物与台车不发生相对滑动、作为整体运动时，求台车能够获得的最大加速度 $a_0$。已知二者之间的静摩擦因数为 $\\mu_0$，用 $\\mu_0$、$g$、$m_1$、$m_2$、$\\theta$ 表示。"}], "answers": [{"type": "math", "tex": "a_0=\\frac{\\mu_0m_2g}{m_1+\\mu_0(m_1+m_2)\\tan\\theta}"}]}, {"label": "（4）", "blocks": [{"type": "paragraph", "text": "某人可以使台车在上述加速度范围内运动，但其最大速度不超过 $v_0$。为了在不发生相对滑动的情况下，以最短时间到达终点，求加速度 $a$、速度 $v$、路程 $s$ 关于时间 $t$ 的函数，并画出图像。已知终点距离 $s_0=v_0^2/a_0$。"}], "answers": [{"type": "paragraph", "text": "关键时刻："}, {"type": "math", "tex": "t_0=\\frac{v_0}{a_0},\\qquad t_1=\\frac{3v_0}{2a_0}"}, {"type": "math", "tex": "a(t)=\\begin{cases}a_0,&0\\le t<t_0,\\\\0,&t_0\\le t\\le t_1.\\end{cases}"}, {"type": "math", "tex": "v(t)=\\begin{cases}a_0t,&0\\le t<t_0,\\\\v_0,&t_0\\le t\\le t_1.\\end{cases}"}, {"type": "math", "tex": "s(t)=\\begin{cases}\\dfrac12a_0t^2,&0\\le t<t_0,\\\\v_0t-\\dfrac{v_0^2}{2a_0},&t_0\\le t\\le t_1.\\end{cases}"}]}]}, {"number": 5, "topic": "综合解答题 1 / 斜面、定滑轮与动滑轮系统", "introduction": [{"type": "paragraph", "text": "质量为 $m$ 的物体 A 放在倾角为 $\\theta$ 的斜面上。A 连接一根绳子，绳子依次绕过斜面顶部的定滑轮以及可以上下移动的动滑轮，最后固定在天花板上。动滑轮连接质量为 $M$ 的物体 B，B 可以沿竖直方向运动。"}, {"type": "paragraph", "text": "A 与斜面之间存在摩擦，静摩擦因数为 $\\mu_0$，动摩擦因数为 $\\mu$。重力加速度大小为 $g$。忽略绳子与滑轮的质量，且满足 $\\tan\\theta>\\mu_0$。"}, {"type": "figure", "id": "textbook-incline", "alt": "物体 A 在斜面上，通过顶部定滑轮和悬挂的动滑轮连接物体 B。"}], "sections": [{"label": "（1）", "blocks": [{"type": "paragraph", "text": "为了使 A 不发生滑动，B 的质量 $M$ 必须在什么范围内？"}], "answers": [{"type": "math", "tex": "2m(\\sin\\theta-\\mu_0\\cos\\theta)\\le M\\le2m(\\sin\\theta+\\mu_0\\cos\\theta)"}]}, {"label": "（2）", "blocks": [{"type": "paragraph", "text": "当 $M$ 足够大，使 A 沿斜面向上滑动时，求 A 的加速度及绳子的张力。"}], "answers": [{"type": "paragraph", "text": "A 的加速度："}, {"type": "math", "tex": "a_1=\\frac{[2M-4m(\\sin\\theta+\\mu\\cos\\theta)]g}{4m+M}"}, {"type": "paragraph", "text": "绳子张力："}, {"type": "math", "tex": "T=\\frac{(2+\\sin\\theta+\\mu\\cos\\theta)mMg}{4m+M}"}]}, {"label": "（3）", "blocks": [{"type": "paragraph", "text": "开始时，B 距离地面的高度为 $h$。当 B 落地时，它不会反弹。此后 A 继续沿斜面上滑一段距离，暂时停止，然后开始下滑。求 A 从开始运动到第一次停止为止沿斜面滑过的总距离。假设斜面足够长，A 不会从斜面顶部飞出。"}], "answers": [{"type": "math", "tex": "S=\\frac{2(2+\\sin\\theta+\\mu\\cos\\theta)Mh}{(\\sin\\theta+\\mu\\cos\\theta)(4m+M)}"}]}, {"label": "（4）", "blocks": [{"type": "paragraph", "text": "当 $M=4m$，$\\theta=30^\\circ$，$g=9.8\\,\\mathrm{m/s^2}$，$h=0.49\\,\\mathrm{m}$，$\\mu=1/(2\\sqrt3)$ 时，画出 A 从开始上滑、到达最高点，再下滑至绳子重新绷紧为止的速度—时间图像。以沿斜面向上为速度正方向。"}], "answers": []}]}]});
Object.assign(PHYSICS_IMAGES,{"textbook-projectile": {"file": "physic-p1-q2.svg", "width": 560.0, "height": 640.0}, "textbook-elevator": {"file": "physic-p1-q3.svg", "width": 460.0, "height": 610.0}, "textbook-cart": {"file": "physic-p1-q4.svg", "width": 1057.0, "height": 1000.0}, "textbook-incline": {"file": "physic-p1-q5.svg", "width": 1200.0, "height": 820.0}});
