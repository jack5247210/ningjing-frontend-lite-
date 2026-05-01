import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Tip {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-consult',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss']
})
export class ConsultComponent implements OnDestroy {
  tips: Tip[] = [
    // 此處放你剛剛改好的繁體中文 tips 陣列
    {
      question: '💆‍♀️ 肩頸僵硬',
      answer: '根據你的描述，這很可能是長期維持同一姿勢導致的斜方肌與提肩胛肌緊繃。\n\n✨ **我的建議是**：\n1. 每小時做一次「肩胛骨後收下沉」動作，每次維持 10 秒。\n2. 熱敷後頸與肩膀交接處 15 分鐘。\n3. 按壓風池穴（後腦髮際凹陷處）與肩井穴。\n\n💡 如果每週仍有反覆不適，推薦搭配「深層筋膜放鬆」或「熱石能量療程」，能更高效地解開肌肉沾黏。'
    },
    {
      question: '💻 數位疲勞 (眼乾/頭痛)',
      answer: '這是典型的「電腦視覺症候群」表現。\n\n🧘 **當下你可以這樣做**：\n• 立即閉眼 1 分鐘，或遠眺 6 米外物體 20 秒。\n• 用溫毛巾敷在眼皮上，促進瞼板腺分泌。\n\n🌿 芳香療法上，我會推薦 **羅馬洋甘菊** 或 **真正薰衣草** 純露濕敷眼部，並配合 **頭部印度滴油 Shirodhara** 療程，能深度釋放頭皮與腦部壓力。'
    },
    {
      question: '🚶‍♂️ 久坐腰痠',
      answer: '久坐會讓髂腰肌縮短、臀肌失憶，導致下背代償性痠痛。\n\n🔄 **改善動作推薦**：\n• 睡前做「貓牛式」6-8 次，活動整個脊柱。\n• 坐在椅子上時，單側翹腳（腳踝放對側膝蓋），身體前傾拉伸臀部。\n\n🌱 若想根本性緩解，建議試試「瑞典式肌肉按摩」或「經絡疏通療程」，針對豎脊肌與腰方肌進行深度放鬆。'
    },
    {
      question: '😴 睡眠品質不佳',
      answer: '大腦無法順利關機，常與褪黑激素分泌不足或交感神經亢奮有關。\n\n🌙 **今晚可以嘗試**：\n1. 睡前 90 分鐘洗熱水澡，讓體溫先升後降誘發睡意。\n2. 在擴香儀中滴入 2 滴 **岩蘭草** + 2 滴 **甜橙**，營造大地般的安穩感。\n3. 避免藍光刺激，改聽低頻白噪音或頌缽音頻。\n\n🔊 如果長期淺眠易醒，我非常推薦你體驗「西藏頌缽音療」，透過聲波共振引導腦波進入深層修復的 Theta 波狀態。'
    },
    {
      question: '🧠 焦慮/大腦超載',
      answer: '我能感受到你處於一種思緒停不下來的狀態，這往往是前額葉過度活躍的表現。\n\n🌬️ **請先跟我做一個呼吸練習**：用鼻子吸氣 4 秒，憋氣 7 秒，嘴巴吐氣 8 秒，重複 3 次。\n\n🌸 日常可以使用 **佛手柑** 或 **苦橙葉** 精油擴香，它們能溫和地提升血清素與 GABA 濃度。若希望獲得更深層的釋放，「銅鑼浴」或「脈輪平衡按摩」能有效重置紊亂的能量場。'
    },
    {
      question: '🦶 下肢沉重/水腫',
      answer: '這種情況通常是因為淋巴回流變慢或靜脈循環不良。\n\n💧 **緩解技巧**：\n• 睡前抬腿高於心臟 15-20 分鐘，期間做腳踝幫浦運動（勾腳/踮腳）。\n• 飲食減少鈉含量，增加紅豆水或玉米鬚茶。\n\n🦵 專業上，我會為你安排「淋巴引流手法」，透過輕柔畫圓的節奏將滯留的組織液推向淋巴結，做完後雙腿會感覺非常輕盈。'
    },
    {
      question: '🖱️ 滑鼠手/手腕僵硬',
      answer: '這是腕隧道症候群的前兆，正中神經受到壓迫了。\n\n✋ **緊急舒緩這樣做**：手臂伸直、手掌朝上，用另一手將手指輕輕往下扳，你會感覺到前臂內側明顯的拉伸感，停留 30 秒。\n\n🌿 複方精油上，我會使用 **冬青** + **薄荷** + **永久花** 稀釋後塗抹手腕與前臂，具有極佳的消炎止痛與促進循環效果。局部經絡推拿也是很有幫助的。'
    },
    {
      question: '🥗 消化不良/脹氣',
      answer: '腸胃是情緒的一面鏡子，壓力大會直接抑制副交感神經對腸胃的調控。\n\n🔄 **飯後可以順時針按摩腹部**（以肚臍為中心），力道輕柔。同時嘗試喝一杯溫熱的 **薄荷茶** 或 **薑茶**。\n\n👐 想更進一步調理，推薦「腹部暖宮/整腹療程」，搭配 **甜茴香** 或 **豆蔻** 精油，能溫和促進腸道蠕動、排出多餘氣體。'
    },
    {
      question: '❄️ 手腳冰冷/循環差',
      answer: '這是末梢微血管收縮、基礎代謝偏低的訊號。\n\n🔥 **升溫小秘訣**：\n• 每天早晨喝一杯 **老薑黑糖水**。\n• 用 40 度熱水泡腳至小腿肚，加入 **艾草** 或 **薑片** 效果更好。\n\n🌡️ 在芳療中，**黑胡椒** 和 **薑** 精油都是著名的「熱性油」，能瞬間帶來溫暖感。搭配「遠紅外線岩盤浴」或「熱力循環按摩」，可以從核心提升體溫。'
    }
  ];

  selectedTip: Tip | null = null;

  getIconForQuestion(question: string): string {
  if (question.includes('肩頸')) return '💆‍♀️';
  if (question.includes('數位') || question.includes('眼')) return '💻';
  if (question.includes('腰')) return '🚶‍♂️';
  if (question.includes('睡眠')) return '😴';
  if (question.includes('焦慮') || question.includes('大腦')) return '🧠';
  if (question.includes('下肢') || question.includes('水腫')) return '🦶';
  if (question.includes('滑鼠') || question.includes('手腕')) return '🖱️';
  if (question.includes('消化') || question.includes('脹氣')) return '🥗';
  if (question.includes('手腳冰冷') || question.includes('循環')) return '❄️';
  return '🌸';
}

  // 打字機相關屬性
  displayedAnswer: string = '';
  isTyping: boolean = false;
  private typingInterval: any;

  selectTip(tip: Tip): void {
    this.selectedTip = tip;
    this.startTypingEffect(tip.answer);
  }

  startTypingEffect(fullText: string): void {
    // 清除之前的計時器
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }

    this.displayedAnswer = '';
    this.isTyping = true;
    let index = 0;

    this.typingInterval = setInterval(() => {
      if (index < fullText.length) {
        this.displayedAnswer += fullText.charAt(index);
        index++;
      } else {
        clearInterval(this.typingInterval);
        this.isTyping = false;
      }
    }, 25); // 每 25 毫秒出現一個字，可自行調整速度
  }

  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }
}
