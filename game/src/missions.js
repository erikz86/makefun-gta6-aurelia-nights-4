import {distance} from './config.js';
export const chapters=[
  {name:'Paket tanpa nama',district:'01 / SALT QUAY',x:1010,y:520,text:'Mara: “Rin, bawa buku pelabuhan ke kios tua. Jangan buka segelnya.”',goal:'Antar paket ke lingkaran emas di Salt Quay. Tekan F.',reward:350},
  {name:'Lampu di kaca spion',district:'02 / GLASS MILE',x:2490,y:1020,text:'Rin: “Nama-nama dalam buku ini milik dewan kota.” Mara: “Ambil mobil. Putuskan jejak mereka.”',goal:'Gunakan mobil, hilangkan wanted, lalu temui Mara di Glass Mile.',reward:700},
  {name:'Dermaga milik siapa?',district:'03 / IRON HARBOR',x:2000,y:2000,text:'Mara: “Geng Cinder menjaga pemancar. Rebut kembali suara warga.”',goal:'Kalahkan 5 penjaga Cinder. Q pistol / pukul, F menyerang.',reward:1200},
  {name:'Fajar yang kita pilih',district:'04 / BEACON POINT',x:500,y:2510,text:'Rin: “Kita siarkan buku itu. Aurelia pantas tahu.”',goal:'Bawa bukti ke mercusuar Beacon Point. Tekan F untuk siaran.',reward:2000}
];
export function missionTarget(s){return chapters[Math.min(s.chapter,3)];}
export function updateMissions(s,input,dt){
  if(s.chapter>=4)return;const m=missionTarget(s);let eligible=true;
  if(s.chapter===1)eligible=!!s.car&&s.wanted===0;
  if(s.chapter===2)eligible=s.kills>=5;
  if(distance(s.player,m)<95&&eligible&&(input.hit('f',' ')||s.chapter===2)){
    s.money+=m.reward;s.chapter++;s.audio.tone(740,.4);s.notice='CHAPTER SELESAI  +$'+m.reward;s.noticeTime=5;
    if(s.chapter===1){s.wanted=2;s.heat=15;}
    s.save();
  }
}
