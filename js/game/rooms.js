export const ROOM_INFO={
  lobby:{name:'THE LOBBY',number:'01',subtitle:'A WARM WELCOME',spawn:850,sky:'#101f38'},
  workshop:{name:'THE WORKSHOP',number:'02',subtitle:'WORKS IN PROGRESS',spawn:390,sky:'#172038'},
  gallery:{name:'THE GALLERY',number:'03',subtitle:'THE FINISHED COLLECTION',spawn:400,sky:'#182035'}
};
export const WORLD_W=1750;
export const WALK_MIN=518, WALK_MAX=646;
export const roomObjects={
  lobby:[
    {id:'lobby-to-workshop',type:'door',x:104,y:440,target:'workshop',label:'ENTER WORKSHOP',hint:'TO THE WORKBENCH'},
    {id:'about',type:'about',x:637,y:339,label:'ABOUT THE BUILDER',hint:'GET TO KNOW JESSE'},
    {id:'resume',type:'resume',x:1160,y:450,label:'RESUME',hint:'THE SHORT VERSION'},
    {id:'career',type:'experience',x:951,y:355,label:'EXPERIENCE',hint:'ENGINEERING & MANUFACTURING'},
    {id:'lobby-to-gallery',type:'door',x:1640,y:440,target:'gallery',label:'ENTER GALLERY',hint:'THE FINISHED COLLECTION'},
  ],
  workshop:[
    {id:'workshop-to-lobby',type:'door',x:110,y:440,target:'lobby',label:'RETURN TO LOBBY',hint:'BACK TO THE LOBBY'},
    {id:'nfc-card',type:'project',x:645,y:452,projectId:'nfc-card',label:'NFC BUSINESS CARD',hint:'PROTOTYPE / REV 2.01'},
    {id:'mcu-cluster',type:'project',x:1058,y:452,projectId:'mcu-cluster',label:'MCU CLUSTER',hint:'WORK IN PROGRESS',markerY:350,labelY:304},
    {id:'capstone-controller',type:'project',x:1461,y:452,projectId:'capstone-controller',label:'CAPSTONE ELECTRONICS',hint:'WORK IN PROGRESS'},
    {id:'revisions',type:'revisions',x:1628,y:350,label:'REWORK & LESSONS',hint:'FRAMED NOTE / DEBUG STORY',markerY:300,labelY:255},
  ],
  gallery:[
    {id:'gallery-to-lobby',type:'door',x:110,y:440,target:'lobby',label:'RETURN TO LOBBY',hint:'BACK TO THE LOBBY'},
    {id:'stm32-card',type:'project',x:650,y:360,projectId:'stm32-card',label:'STM32 BUSINESS CARD',hint:'FINISHED / EXHIBIT 01'},
    {id:'team-fishies',type:'project',x:1180,y:370,projectId:'team-fishies',label:'TEAM FISHIES',hint:'FINISHED / EXHIBIT 02'},
  ]
};
