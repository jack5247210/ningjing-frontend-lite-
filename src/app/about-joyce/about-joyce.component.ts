import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';   // 加入這行

@Component({
  selector: 'app-about-joyce',
  standalone: true,               // 如果原本就是 standalone 元件
  imports: [CommonModule],        // 加入 CommonModule
  templateUrl: './about-joyce.component.html',
  styleUrls: ['./about-joyce.component.scss']
})
export class AboutJoyceComponent {
// 依年份排序的證照資料
  certificates = [
    {
      year: '2015',
      items: [
        '前 AVEDA 芳療師',
        '芳療職人學員（由前肯園 Susan 老師教授）',
        '加拿大 EAMT 孕婦按摩證照',
        '加拿大 EAMT 產後護理證照',
        '加拿大 HMTAC 整體治療協會會員',
        '英國 Beauty guild 美容治療師工會會員',
        '美國 NAHA 專業芳療師中階'
      ]
    },
    {
      year: '2016',
      items: [
        '天使療法',
        '肯園 Sunny 老師氣卦教育課程',
        '芳療職人大地孕育孕婦按摩結業',
        '芳療職人創造力能量按摩結業',
        '現代心理占星解讀'
      ]
    },
    {
      year: '2017',
      items: [
        '太乙鬆筋（肯園 Sunny 老師教授）',
        'SMA-C 神經肌肉放鬆、全身激痛點與 PNF 技術研習',
        '頌缽音療（光音仙境 楊寧芙老師教授）'
      ]
    },
    {
      year: '2018-2019',
      items: [
        '銅鑼道整體聲音共振療癒 – 師承 Don Conreaux 大師',
        '覺知孕育 – 孕婦瑜珈師資培訓結業',
        '昆達里尼瑜珈一級教師',
        'O 環測試初進階 – 師承 黃錫基老師',
        'SRT 靈性反應療法執行師',
        '2019 跨年徹夜銅鑼祭典 – 擔任冥想帶領人',
        '臼井靈氣 一二階療癒師',
        '古典占星 – 師承亞洲古占權威 秦瑞生老師',
        '新巴哈花精療癒諮詢'
      ]
    },
    {
      year: '2020',
      items: [
        '古印度吠陀占星解讀 – 師承亞洲占星權威 秦瑞生老師'
      ]
    },
    {
      year: '2022',
      items: [
        '水晶光能療癒師'
      ]
    },
    {
      year: '2023',
      items: [
        '古典派皮拉提斯一級墊上師資'
      ]
    },
    {
      year: '2024',
      items: [
        'RYT200 哈達瑜珈師資'
      ]
    }
  ];
}
