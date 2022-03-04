const mapData = {
  one: {
    iWidth: 30,
    iHeight: 20,
    characters: [
      { pos: 155, avatar: 'bunny', spritePos: 0, event: 'hello', name: 'bunnio' },
      { pos: 156, avatar: 'bunny', spritePos: 0, event: 'apple', name: 'usabon' },
      { pos: 309, avatar: 'bunny', spritePos: 0, event: 'tomato', name: 'tololo' },
    ],
    events: {
      5: { event: 'transport', gateway: 'portal3'},
      6: { event: 'transport', gateway: 'portal3'},
      419: { event: 'transport', gateway: 'portal4'},
      449: { event: 'transport', gateway: 'portal4'},
      253: { event: 'transport', gateway: 'portal7'},
      288: { event: 'transport', gateway: 'portal6'},
      167: { event: 'transport', gateway: 'portal13'},
    },
    map: 'v5,b2,v24,w4,b2,w22,v2,w1,b14,d1,pt2,s1,b8,w1,v2,w1,b12,t1,b1,g1,pb2,y1,b6,t1,b1,w1,v2,w1,b2,t1,b10,d1,al1,p1,nr1,sr1,pt1,s1,b6,w1,v2,w1,b10,d1,pt2,pu1,rr1,do1,ab1,rl1,rp1,pr1,b6,w1,v2,w1,b6,t1,b3,g1,rc1,pb1,g1,pb5,y1,b6,w1,v2,w1,b10,sl1,p1,nr1,al1,p5,ar1,b6,w1,v2,w1,b10,bl1,do1,ab1,al1,wi1,p1,sw1,p1,wi1,ar1,b2,d1,pt1,s1,b1,w1,v2,w1,b13,bl1,ab2,do1,ab2,bb1,b2,g1,rc1,y1,b1,w1,v2,w1,b1,t1,b3,t1,b3,t1,b12,sl1,p1,sr1,b1,w1,v2,w1,b19,t1,b2,bl1,do1,bb1,b1,w1,v2,w1,b2,t1,b6,ra1,rh5,rb1,b10,w1,v2,w1,b5,ra1,rh3,rd1,b5,r1,b12,v1,w1,b5,r1,b7,w1,b1,r1,b7,t1,b4,v1,w1,b1,t1,b3,r1,b1,t1,b7,r1,b4,t1,b5,w1,v2,w1,b5,r1,b5,w1,b3,re1,rh2,rb1,b7,w1,v2,w1,b5,r1,b12,r1,b7,w1,v2,w6,r1,w12,r1,w8,v8,r1,v12,r1,v9',
    eventContents: {
      hello: { first:{ text:['hello!'], }, },
      tomato: {
        first:{ 
          text:['hello!', 'test'], 
          face:['happy', 'sad'], 
        },
      },
      apple: {
        first:{ 
            text:['how are you?', 'test'], 
            choice: {
              'okay': 's_1',
              'not so good': 's_2',
              'banana' : 'banana'
            }
          },
        s_1: {
          text: ['yeah!'], 
            choice: {
              'yes': 's_3',
              'no': 's_4'
            }
          },
        s_2: {
          text: ['really?'], 
            choice: {
              'yes': 's_3',
              'no': 's_4'
            }
          },
        s_3: { text: ['cool!','cool two'] },
        s_4: { 
          text: ['whatever'],
          face: ['sad'] 
        },  
        banana: { text: ['banana!', 'bananananana!'] }  
      }
    },
    entry: {
      start: {
        // map: 'one',
        // cell: 313,
        map: 'three',
        cell: 188,
      },
      portal3: {
        map: 'three',
        cell: 224,
        direction: 'up'
      },
      portal4: {
        map: 'four',
        cell: 81,
        direction: 'right'
      },
      portal7: {
        map: 'house_one_0',
        cell: 62,
        direction: 'up',
        noWall: ['bt','at','rtl','rtr','ar','bx','ab','by','p','la','e']
      },
      portal6: {
        map: 'house_one_0',
        cell: 79,
        direction: 'up',
        noWall: ['bt','at','rtl','rtr','ar','bx','ab','by','p','la','e']
      },
      portal13: {
        map: 'house_one_1',
        cell: 26,
        direction: 'up',
        noWall: ['ry','bt','at','rtl','rtr','ar','bx','ab','by','p','la','lh','e']
      },
    },
  },
  two: {
    iWidth: 40,
    iHeight: 30,
    characters: [
      { pos: 779, avatar: 'bunny', spritePos: 0, event: 'hello', name: 'carrot' },
    ],
    events: {
      1178: { event: 'transport', gateway: 'portal1'},
      1179: { event: 'transport', gateway: 'portal1'},
      1180: { event: 'transport', gateway: 'portal1'},
    },
    map: 'v18,b3,v20,w17,b3,w12,v8,w1,b30,w1,v2,t1,v5,w1,b11,t1,b18,w1,v8,w1,b6,t1,b19,t1,b3,w1,v5,t1,v2,w1,b2,t1,b27,w1,v8,w1,b18,t1,b2,t1,b8,w7,v2,w1,b36,w1,v2,w1,b11,t1,b24,w1,v2,w1,b33,t1,b2,w1,v2,w1,b6,t1,b29,w1,v2,w1,b2,t1,b20,o8,b5,w1,v2,w1,b23,o8,b5,w1,v2,w1,b16,t1,b6,o8,b5,w1,v2,w1,b23,o8,b2,t1,b2,w1,v2,w1,b23,o8,b5,w1,v2,w1,b3,t1,b8,t1,b10,o8,b5,w1,v2,w1,b36,w1,v2,w1,b36,w1,v2,w1,b7,t1,b25,t1,b2,w1,v2,w1,b36,w1,v2,w13,b24,w1,v14,w1,b4,t1,b4,t1,b9,t1,b4,w1,v4,t1,v4,t1,v4,w1,b24,w1,v14,w1,b24,w1,v6,t1,v7,w1,b1,t1,b22,w1,v12,t1,v1,w1,b12,t1,b3,t1,b2,t1,b4,w1,v14,w1,b24,w1,v4,t1,v5,t1,v3,w5,b3,w18,v19,b3,v19',
    eventPoints: {
      hello: { text: ['hello!'] },
    },
    entry: {
      portal1: {
        map: 'one',
        cell: 35,
        direction: 'down',
      },
    }
  },
  three: {
    iWidth: 18,
    iHeight: 14,
    characters: [
      { pos: 135, avatar: 'bunny', spritePos: 9, event: 'hello', name: 'talala' },
      { pos: 101, avatar: 'bunny', spritePos: 6, event: 'hello', name: 'kira' },
      { pos: 165, avatar: 'bunny', spritePos: 3, event: 'hello', name: 'tontoko' },
    ],
    events: {
      241: { event: 'transport', gateway: 'portal1'},
      242: { event: 'transport', gateway: 'portal1'},
      243: { event: 'transport', gateway: 'portal1'},
      62: { event: 'check', index: 'tree1'},
      112: { event: 'check', index: 'bunny1'},
    },
    map: 'v19,ta1,tb1,ta1,tb1,ta1,tb1,ta1,tb1,ta1,tb1,ta1,tb1,ta1,tb1,ta1,tb1,v2,tc1,td1,tc1,td1,tc1,td1,tc1,td1,tc1,td1,tc1,td1,tc1,td1,tc1,td1,v2,ta1,tb1,b12,ta1,tb1,v2,tc1,td1,b12,tc1,td1,v2,ta1,tb1,o1,b10,o1,ta1,tb1,v2,tc1,td1,o1,b6,ta1,tb1,b2,o1,tc1,td1,v2,ta1,tb1,o1,b6,tc1,td1,b2,o1,ta1,tb1,v2,tc1,td1,b12,tc1,td1,v2,ta1,tb1,b12,ta1,tb1,v2,tc1,td1,b12,tc1,td1,v2,ta1,tb1,ta1,tb1,ta1,tb1,b2,ta1,tb1,ta1,tb1,ta1,tb1,ta1,tb1,v2,tc1,td1,tc1,td1,tc1,td1,b2,tc1,td1,tc1,td1,tc1,td1,tc1,td1,v8,b2,v9',
    eventContents: {
      hello: { 
        first:{ 
          text:['hello!'], 
        }, 
      },
      tree1: {
        text: [
          'hello! I\'m a tree!',
          'yeah!'
        ],
        art: 'http://masahito.co.uk/img/icecream_bunny.png',
        // item: null,
        direction: 'up'
      },
      bunny1: {
        text: ['hello! Bunny!'],
        // item: null,
        direction: 'left'
      },
    },
    entry: {
      portal1: {
        map: 'one',
        cell: 35,
        direction: 'down',
      },
    }
  },
  four: {
    iWidth: 20,
    iHeight: 10,
    events: {
      80: { event: 'transport', gateway: 'portal5'},
      100: { event: 'transport', gateway: 'portal5'},
    },
    map: 'v21,w14,v6,w1,b12,w1,v6,w1,b2,o3,b7,w5,v1,b18,w1,v1,b18,w1,v2,w1,b12,o3,b1,w1,v2,w1,b16,w1,v2,w18,v21',
    entry: {
      portal5: {
        map: 'one',
        cell: 418,
        direction: 'left'
      },
    }
  },
  house_one_0: {
    name: 'house_one_0',
    iWidth: 12,
    iHeight: 9,
    events: {
      74: { event: 'transport', gateway: 'portal8'},
      91: { event: 'transport', gateway: 'portal9'},
      5: { event: 'transport', gateway: 'portal10'},
    },
    map: 'bd4,rp1,la1,rp5,bd5,rp1,la1,rp5,bd2,rp4,la1,rp5,bd2,rp3,ry1,at5,rt1,bd2,ry1,at2,p6,ar1,bd2,bx1,p1,ab1,p6,ar1,bd3,e1,bd1,bx1,ab2,p1,ab2,by1,bd8,e1,bd16',
    entry: {
      portal8: {
        map: 'one',
        cell: 283,
        direction: 'down',
      },
      portal9: {
        map: 'one',
        cell: 318,
        direction: 'down',
      },
      portal10: {
        map: 'house_one_1',
        cell: 21,
        direction: 'down',
        noWall: ['ry','bt','at','rtl','rtr','ar','bx','ab','by','p','la','lh','e']
      }, 
    }
  },
  house_one_1: {
    iWidth: 6,
    iHeight: 6,
    events: {
      20: { event: 'transport', gateway: 'portal11'},
      32: { event: 'transport', gateway: 'portal12'},
    },
    map: 'bd7,rp4,bd2,rp1,la1,rp2,bd2,ry1,lh1,at1,rt1,bd2,bx1,p1,ab1,by1,bd3,e1,bd3',
    entry: {
      portal11: {
        map: 'house_one_0',
        cell: 5,
        direction: 'up',
        noWall: ['bt','at','rtl','rtr','ar','bx','ab','by','p','la','e']
      },
      portal12: {
        map: 'one',
        cell: 197,
        direction: 'down',
        noWall: ['d','pt','s','pu','rp','pr','g','pb','y','do']
      },
    }
  }
}

export default mapData