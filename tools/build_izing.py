"""Build izing/data/hexagrams.json from judgments-legge.json (Legge 1882, extracted and cleaned), hip.json (Zing versions)
and the hexagram table below. Run from the repo root: python3 -I tools/build_izing.py
Line patterns come from the King Wen trigram pairs (lower, upper); they were checked against Legge's line texts
("The first line, undivided ...") for all 64 hexagrams. Lines are listed bottom to top, 1 = yang (unbroken)."""
import json
TRI={'☰':(1,1,1),'☷':(0,0,0),'☳':(1,0,0),'☵':(0,1,0),'☶':(0,0,1),'☴':(0,1,1),'☲':(1,0,1),'☱':(1,1,0)}
# number: (trigrams lower+upper, chinese, pinyin, english label, Legge's romanisation)
H="""☰☰ 乾 Qián|The Creative|Khien
☷☷ 坤 Kūn|The Receptive|Khwan
☳☵ 屯 Zhūn|Difficulty at the Beginning|Kun
☵☶ 蒙 Méng|Youthful Folly|Mang
☰☵ 需 Xū|Waiting|Hsu
☵☰ 訟 Sòng|Conflict|Sung
☵☷ 師 Shī|The Army|Sze
☷☵ 比 Bǐ|Holding Together|Pi
☰☴ 小畜 Xiǎo Chù|The Small Taming|Hsiao Khu
☱☰ 履 Lǚ|Treading|Li
☰☷ 泰 Tài|Peace|Thai
☷☰ 否 Pǐ|Standstill|Phi
☲☰ 同人 Tóng Rén|Fellowship|Thung Zan
☰☲ 大有 Dà Yǒu|Great Possession|Ta Yu
☶☷ 謙 Qiān|Humility|Khien
☷☳ 豫 Yù|Enthusiasm|Yu
☳☱ 隨 Suí|Following|Sui
☴☶ 蠱 Gǔ|Mending What Is Spoiled|Ku
☱☷ 臨 Lín|Approach|Lin
☷☴ 觀 Guān|Contemplation|Kwan
☳☲ 噬嗑 Shì Kè|Biting Through|Shih Ho
☲☶ 賁 Bì|Grace|Pi
☷☶ 剝 Bō|Splitting Apart|Po
☳☷ 復 Fù|Return|Fu
☳☰ 無妄 Wú Wàng|Innocence|Wu Wang
☰☶ 大畜 Dà Chù|The Great Taming|Ta Khu
☳☶ 頤 Yí|Nourishment|I
☴☱ 大過 Dà Guò|Great Excess|Ta Kwo
☵☵ 坎 Kǎn|The Abyss|Khan
☲☲ 離 Lí|The Clinging Fire|Li
☶☱ 咸 Xián|Influence|Hsien
☴☳ 恆 Héng|Duration|Hang
☶☰ 遯 Dùn|Retreat|Thun
☰☳ 大壯 Dà Zhuàng|Great Power|Ta Kwang
☷☲ 晉 Jìn|Progress|Zin
☲☷ 明夷 Míng Yí|Darkening of the Light|Ming I
☲☴ 家人 Jiā Rén|The Family|Kia Zan
☱☲ 睽 Kuí|Opposition|Khwei
☶☵ 蹇 Jiǎn|Obstruction|Kien
☵☳ 解 Jiě|Deliverance|Kieh
☱☶ 損 Sǔn|Decrease|Sun
☳☴ 益 Yì|Increase|Yi
☰☱ 夬 Guài|Breakthrough|Kwai
☴☰ 姤 Gòu|Coming to Meet|Kau
☷☱ 萃 Cuì|Gathering Together|Zhui
☴☷ 升 Shēng|Pushing Upward|Shang
☵☱ 困 Kùn|Oppression|Khwan
☴☵ 井 Jǐng|The Well|Zing
☲☱ 革 Gé|Revolution|Ko
☴☲ 鼎 Dǐng|The Cauldron|Ting
☳☳ 震 Zhèn|The Thunder|Kan
☶☶ 艮 Gèn|Keeping Still|Kan
☶☴ 漸 Jiàn|Gradual Progress|Kien
☱☳ 歸妹 Guī Mèi|The Marrying Maiden|Kwei Mei
☲☳ 豐 Fēng|Abundance|Fang
☶☲ 旅 Lǚ|The Wanderer|Lu
☴☴ 巽 Xùn|The Gentle Wind|Sun
☱☱ 兌 Duì|The Joyous Lake|Tui
☵☴ 渙 Huàn|Dispersion|Hwan
☱☵ 節 Jié|Limitation|Kieh
☱☴ 中孚 Zhōng Fú|Inner Truth|Kung Fu
☶☳ 小過 Xiǎo Guò|Small Excess|Hsiao Kwo
☲☵ 既濟 Jì Jì|After Completion|Ki Zi
☵☲ 未濟 Wèi Jì|Before Completion|Wei Zi""".split('\n')
assert len(H)==64
J=json.load(open('izing/data/judgments-legge.json',encoding='utf8'))
Z=json.load(open('izing/data/hip.json',encoding='utf8'))
out=[]
for n,row in enumerate(H,1):
    head,eng,legge=row.split('|')
    tri,zh,py=head.split(' ',2)
    lines=list(TRI[tri[0]]+TRI[tri[1]])
    out.append(dict(n=n,glyph=chr(0x4DC0+n-1),chinese=zh,pinyin=py,english=eng,legge_name=legge,lines=lines,
                    legge=J[str(n)],zing=Z[str(n)]))
assert len({tuple(h['lines']) for h in out})==64   # every hexagram distinct
json.dump(out,open('izing/data/hexagrams.json','w',encoding='utf8'),ensure_ascii=False,indent=1)
print('wrote izing/data/hexagrams.json',len(out))
