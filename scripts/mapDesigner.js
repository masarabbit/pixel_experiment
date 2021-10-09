function init() {
  
  //TODO change style to display grid number using pseudo elements
  //TODO add highlights for event points etc





  let cellSize = 20
  let row = 20
  let column = 20
  let selectCopy = false

  const decode = arr =>{
    return arr.split('').map(c=>{
      if (c === 'D') return '<path d="M'
      if (c === 'F') return '<path fill="#fff" d="M'
      if (c === '/') return '/>'
      if (c === 'N') return '-1' 
      if (c === 'T') return '-2'
      return c
    }).join('')
  }

  const mapData = [
    {
      name: 'one',
      iWidth: 30,
      iHeight: 20,
      characters: [
        '155_bunny_0_hello',
        '156_bunny_0_apple',
        '309_bunny_0_tomato'
      ],
      events: [
        '5_transport-portal3',
        '6_transport-portal3',
        '419_transport-portal4',
        '449_transport-portal4',
        '253_transport-portal7',
        '288_transport-portal6'
      ],
      map: 'v5,b2,v24,w4,b2,w22,v2,w1,b14,d1,pt2,s1,b8,w1,v2,w1,b12,t1,b1,g1,pb2,y1,b6,t1,b1,w1,v2,w1,b2,t1,b10,d1,al1,p1,nr1,sr1,pt1,s1,b6,w1,v2,w1,b10,d1,pt2,pu1,rr1,do1,ab1,rl1,rp1,pr1,b6,w1,v2,w1,b6,t1,b3,g1,rc1,pb1,g1,pb5,y1,b6,w1,v2,w1,b10,sl1,p1,nr1,al1,p5,ar1,b6,w1,v2,w1,b10,bl1,do1,ab1,al1,wi1,p1,sw1,p1,wi1,ar1,b2,d1,pt1,s1,b1,w1,v2,w1,b13,bl1,ab2,do1,ab2,bb1,b2,g1,rc1,y1,b1,w1,v2,w1,b1,t1,b3,t1,b3,t1,b12,sl1,p1,sr1,b1,w1,v2,w1,b19,t1,b2,bl1,do1,bb1,b1,w1,v2,w1,b2,t1,b6,ra1,rh5,rb1,b10,w1,v2,w1,b5,ra1,rh3,rd1,b5,r1,b12,v1,w1,b5,r1,b7,w1,b1,r1,b7,t1,b4,v1,w1,b1,t1,b3,r1,b1,t1,b7,r1,b4,t1,b5,w1,v2,w1,b5,r1,b5,w1,b3,re1,rh2,rb1,b7,w1,v2,w1,b5,r1,b12,r1,b7,w1,v2,w6,r1,w12,r1,w8,v8,r1,v12,r1,v9',
    },
    {
      name: 'two',
      iWidth: 40,
      iHeight: 30,
      characters: [
        '779_bunny_0_hello'
      ],
      events: [
        '1178_transport-portal1',
        '1179_transport-portal1',
        '1180_transport-portal1'
      ],
      map: 'v18,b3,v20,w17,b3,w12,v8,w1,b30,w1,v2,t1,v5,w1,b11,t1,b18,w1,v8,w1,b6,t1,b19,t1,b3,w1,v5,t1,v2,w1,b2,t1,b27,w1,v8,w1,b18,t1,b2,t1,b8,w7,v2,w1,b36,w1,v2,w1,b11,t1,b24,w1,v2,w1,b33,t1,b2,w1,v2,w1,b6,t1,b29,w1,v2,w1,b2,t1,b20,o8,b5,w1,v2,w1,b23,o8,b5,w1,v2,w1,b16,t1,b6,o8,b5,w1,v2,w1,b23,o8,b2,t1,b2,w1,v2,w1,b23,o8,b5,w1,v2,w1,b3,t1,b8,t1,b10,o8,b5,w1,v2,w1,b36,w1,v2,w1,b36,w1,v2,w1,b7,t1,b25,t1,b2,w1,v2,w1,b36,w1,v2,w13,b24,w1,v14,w1,b4,t1,b4,t1,b9,t1,b4,w1,v4,t1,v4,t1,v4,w1,b24,w1,v14,w1,b24,w1,v6,t1,v7,w1,b1,t1,b22,w1,v12,t1,v1,w1,b12,t1,b3,t1,b2,t1,b4,w1,v14,w1,b24,w1,v4,t1,v5,t1,v3,w5,b3,w18,v19,b3,v19'
    },
    {
      name: 'three',
      iWidth: 18,
      iHeight: 14,
      characters: [
        '135_bunny_9_hello',
        '101_bunny_6_hello',
        '165_bunny_3_hello'
      ],
      events: [
        '241_transport-portal1',
        '242_transport-portal1',
        '243_transport-portal1',
        '44_check-tree1',
        '112_check-bunny1'
      ],
      map: 'v19,w16,v2,w1,b1,o3,b6,o3,b1,w1,v2,w1,b14,w1,v2,w1,b14,w1,v2,w1,b1,o1,b10,o1,b1,w1,v2,w1,b1,o1,b10,o1,b1,w1,v2,w1,b1,o1,b10,o1,b1,w1,v2,w1,b14,w1,v2,w1,b14,w1,v2,w1,b14,w1,v2,w1,b1,o3,b6,o3,b1,w1,v2,w6,b3,w7,v8,b3,v8'
    },
    {
      name: 'four',
      iWidth: 20,
      iHeight: 10,
      events: [
        '80_transport-portal5',
        '100_transport-portal5'
      ],
      map: 'v21,w14,v6,w1,b12,w1,v6,w1,b2,o3,b7,w5,v1,b18,w1,v1,b18,w1,v2,w1,b12,o3,b1,w1,v2,w1,b16,w1,v2,w18,v21'
    },
    {
      name: 'house_one',
      iWidth: 12,
      iHeight: 9,
      events: [
        '74_transport-portal8',
        '91_transport-portal9'
      ],
      map: 'bd4,rp1,la1,rp5,bd5,rp1,la1,rp5,bd2,rp4,la1,rp5,bd2,rp3,ry1,at5,rt1,bd2,ry1,at2,p6,ar1,bd2,bx1,p1,ab1,p6,ar1,bd3,e1,bd1,bx1,ab2,p1,ab2,by1,bd8,e1,bd16'
    }
  ]

  const svgWrapper = (content, color, rotate, flip, wrapper ) =>{
    let scale = 1
    if (flip === 'h') scale = '-1, 1'
    if (flip === 'v') scale = '1, -1'
    return `
      <div class="${wrapper}" style="transform: rotate(${rotate}deg) scale(${scale});">
        <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 16 16" fill="${color ? color : 'black'}">${content}</svg>
      </div>
      `
  }


  const randomColor = () =>{
    const r = ()=> Math.ceil(Math.random() * 255)
    return `rgb(${r()},${r()},${r()})`
  }

  const randomGreen = () =>{
    const r = ()=> Math.ceil(Math.random() * 80)
    const g = ()=> Math.ceil(Math.random() * 155) + 100
    const b = ()=> Math.ceil(Math.random() * 100)
    return `rgb(${r()},${g()},${b()})`
  }

  const tree = () =>{
    return 'D 5 0h6v1h2v1h1v1h1v1h1v7hNv1hNv1hNv1hTv2hNv-3hNvNhTv1hNv3hNvThTvNhNvNhNvNhNv-7h1vNh1vNh1vNh2vN"/ F 7 12h2v1h1v3h-4v-3h1vN"/'
  }

  const flowers = () =>{
    return 'D 2 1h2v1hTvN"/ D 1 2h1v1hNvN"/ D 4 2h1v1hNvN"/ D 2 3h2v1hTvN"/ D 11 4h2v1hTvN"/ D 10 5h1v1hNvN"/ D 13 5h1v1hNvN"/ D 11 6h2v1hTvN"/ D 4 8h2v1hTvN"/ D 3 9h1v1hNvN"/ D 6 9h1v1hNvN"/ D 4 10h2v1hTvN"/ D 13 12h2v1hTvN"/ D 12 13h1v1hNvN"/ D 15 13h1v1hNvN"/ D 13 14h2v1hTvN"/'
  }

  const buildingCorner = subColor =>{
    return `D 5 0h11v1hN1vN"/ D 3 1h2v1hTvN"/ <path fill="${subColor || 'white'}" d="M 5 1h11v15hN5vN1h1vTh1vNh2vN"/ D 2 2h1v1hNvN"/ D 1 3h1v2hNvT"/ D 0 5h1v11hNvN1"/`
  }

  const roofCorner = subColor =>{
    return `D 0 0h1v11h1v2hNv3hNvN6"/ <path fill="${subColor || 'white'}" d="M 1 0h15v15hN1vNhTvNhNvThNvN1"/ F 1 13h1v1h1v1h2v1h-4v-3"/ D 2 13h1v1hNvN"/ D 3 14h2v1hTvN"/ D 5 15h11v1hN1vN"/`
  }

  const checkered = () =>{
    return 'D 0 0h2v2hTvT"/ D 4 0h2v2hTvT"/ D 8 0h2v2hTvT"/ D 12 0h2v2hTvT"/ D 2 2h2v2hTvT"/ D 6 2h2v2hTvT"/ D 10 2h2v2hTvT"/ D 14 2h2v2hTvT"/ D 0 4h2v2hTvT"/ D 4 4h2v2hTvT"/ D 8 4h2v2hTvT"/ D 12 4h2v2hTvT"/ D 2 6h2v2hTvT"/ D 6 6h2v2hTvT"/ D 10 6h2v2hTvT"/ D 14 6h2v2hTvT"/ D 0 8h2v2hTvT"/ D 4 8h2v2hTvT"/ D 8 8h2v2hTvT"/ D 12 8h2v2hTvT"/ D 2 10h2v2hTvT"/ D 6 10h2v2hTvT"/ D 10 10h2v2hTvT"/ D 14 10h2v2hTvT"/ D 0 12h2v2hTvT"/ D 4 12h2v2hTvT"/ D 8 12h2v2hTvT"/ D 12 12h2v2hTvT"/ D 2 14h2v2hTvT"/ D 6 14h2v2hTvT"/ D 10 14h2v2hTvT"/ D 14 14h2v2hTvT"/'
  }

  const plain = subColor =>{
    return `<path fill="${subColor || 'white'}" d="M 0 0h16v16hN6vN6"/`
  }

  const plainEdge = subColor =>{
    return `D 0 0h16v1hN6vN"/ <path fill="${subColor || 'white'}" d="M 0 1h16v15hN6vN5"/`
  }

  const door = () =>{
    return 'F 0 0h16v15hNvN0hNvThTvNhTvNh-4v1hTv1hTv2hNv10hNvN5"/ D 6 1h4v1h2v1h2v2h1v10h1v1hN6vNh1vN0h1vTh2vNh2vN"/'
  }

  const roundWindow = () =>{
    return 'F 0 0h16v16hN6vN6"/ D 6 2h4v1h2v1h1v2h1v4hNv2hNv1hTv1h-4vNhTvNhNvThNv-4h1vTh1vNh2vN"/'
  }

  const squareWindow = () =>{
    return 'F 0 0h16v16hN6vN6"/ D 5 2h6v1h1v10hNv1h-6vNhNvN0h1vN"/'
  }

  const sideSquareWindow = () =>{
    return 'D 0 0h1v16hNvN6"/ F 1 0h15v16h-3vNh1v-9hNvNh-4v1hNv9h1v1h-8vN6"/ D 9 5h4v1h1v9hNv1h-4vNhNv-9h1vN"/'
  }

  const noSideWindow = () =>{
    return 'F 0 0h16v16h-3vNh1v-9hNvNh-4v1hNv9h1v1h-9vN6"/ D 9 5h4v1h1v9hNv1h-4vNhNv-9h1vN"/`'
  }

  const roofCurve = subColor =>{
    return `<path fill="${subColor || 'white'}" d="M 0 0h16v15hTvNhNvNhNvNhTvNh-4v1hTv1hNv1hNv1hTvN5"/ D 6 11h4v1h-4vN"/ D 4 12h2v1hTvN"/ F 6 12h4v1h2v1h1v1h1v1hN2vNh1vNh1vNh2vN"/ D 10 12h2v1hTvN"/ D 3 13h1v1hNvN"/ D 12 13h1v1hNvN"/ D 2 14h1v1hNvN"/ D 13 14h1v1hNvN"/ D 0 15h2v1hTvN"/ D 14 15h2v1hTvN"/`
  }

  const roofTopBottomCorner = subColor =>{
    return `D 0 0h1v11hNvN1"/ F 1 0h15v15hN1vNhTvNhNvThNvN1"/ <path fill="${subColor || 'white'}" d="M 0 11h1v2h1v1h1v1h2v1h-5v-5"/ D 1 11h1v2hNvT"/ D 2 13h1v1hNvN"/ D 3 14h2v1hTvN"/ D 5 15h11v1hN1vN"/`
  }

  const river = () =>{
    const main = '#58d3d8'
    const sub = '#a2fcf0'

    return `<path fill="${main}" d="M 0 0h2v7h2v-7h12v16hTv-7hTv7hN2vN6"/ <path fill="${sub}" d="M 2 0h2v7hTv-7"/ <path fill="${sub}" d="M 7 4h2v8hTv-8"/ <path fill="${sub}" d="M 12 9h2v7hTv-7"/`
  }

  const riverAnim = () =>{
    const main = '#58d3d8'
    const sub = '#a2fcf0'

    return `<path fill="${main}" d="M 0 0h7v4h2v-4h7v16h-7v-5hTv5h-7vN6"/ <path fill="${sub}" d="M 7 0h2v4hTv-4"/ <path fill="${sub}" d="M 12 3h2v9hTv-9"/ <path fill="${sub}" d="M 2 4h2v9hTv-9"/ <path fill="${sub}" d="M 7 11h2v5hTv-5"/`
  }

  const riverCurve = () =>{
    const main = '#58d3d8'
    const sub = '#a2fcf0'

    return `<path fill="${main}" d="M 8 0h8v16h-7v-4h1vTh1vNh2vThTv1hNv1hNv1hNv2hNv4h-7v-8h1vTh1vTh1vNh1vNh2vNh2vN"/ <path fill="${sub}" d="M 10 2h5v2h-5v1hTv1hNv1hTvTh2vNh1vNh2vN"/ <path fill="${sub}" d="M 11 7h2v2hTv1hNv2hNv4hTv-4h1vTh1vNh1vNh1vN"/`
  }

  const riverCurveAnim = () =>{
    const main = '#58d3d8'
    const sub = '#a2fcf0'
    
    return ` <path fill="${main}" d="M 8 0h8v2h-3v1h-4v2h4vNh3v8hTv1hTv3h-8v-5h1vThTv2hNv5hTv-8h1vTh1vTh1vNh1vNh2vNh2vN"/ <path fill="${sub}" d="M 13 2h3v2h-3v1h-4vTh4vN"/ <path fill="${sub}" d="M 10 7h3v2h-3v1hNv1hTvTh1vNh2vN"/ <path fill="${sub}" d="M 3 9h2v2hNv5hTv-5h1vT"/ <path fill="${sub}" d="M 14 12h2v2hTv2hTv-3h2vN"/ <path fill="${main}" d="M 14 14h2v2hTvT"/`
  }

  const ladder = subColor =>{
    // return `<path fill="${subColor || 'white'}" d="M 0 0h16v16hN6vN6"/ D 4 1h8v1h-8vN"/ D 4 5h8v1h-8vN"/ D 4 9h8v1h-8vN"/ D 4 13h8v1h-8vN"/`
    return `<path fill="${subColor || 'white'}" d="M 0 0h16v16hN6vN6"/ D 3 1h1v1hNvN"/ D 12 1h1v1hNvN"/ D 4 2h8v1h-8vN"/ D 3 5h1v1hNvN"/ D 12 5h1v1hNvN"/ D 4 6h8v1h-8vN"/ D 3 9h1v1hNvN"/ D 12 9h1v1hNvN"/ D 4 10h8v1h-8vN"/ D 3 13h1v1hNvN"/ D 12 13h1v1hNvN"/ D 4 14h8v1h-8vN"/`
  } // return `<path fill="${subColor || 'white'}" d="M 0 0h16v16hN6vN6"/ D 4 1h8v1h-8vN"/ D 4 5h8v1h-8vN"/ D 4 9h8v1h-8vN"/ D 4 13h8v1h-8vN"/`

  const exit = (main , subColor) =>{
    // return `
    // <path fill="${main}" d="M 0 0h16v1hNv1hNv1hNv1hNv1hTv1h-4vNhTvNhNvNhNvNhNvNhNvN"/ <path fill="${subColor}" d="M 0 1h1v1h1v1h1v1h1v1h2v1h4vNh2vNh1vNh1vNh1vNh1v15hN6vN5"/
    // `
    return `<path fill="${main}" d="M 0 0h16v4hTv2hTvThTv2hTvThTv2hTvThTv2hTv-6"/ <path fill="${subColor}" d="M 2 4h2v2hTvT"/ <path fill="${subColor}" d="M 6 4h2v2hTvT"/ <path fill="${subColor}" d="M 10 4h2v2hTvT"/ <path fill="${subColor}" d="M 14 4h2v2hTvT"/ <path fill="${subColor}" d="M 0 6h2v2h2vTh2v2h2vTh2v2h2vTh2v2h2v8hN6vN0"/ <path fill="${main}" d="M 2 6h2v2hTvT"/ <path fill="${main}" d="M 6 6h2v2hTvT"/ <path fill="${main}" d="M 10 6h2v2hTvT"/ <path fill="${main}" d="M 14 6h2v2hTvT"/`
    // return `<path fill="${main}" d="M 0 0h2v2hTvT"/ <path fill="${subColor}" d="M 2 0h2v2hTvT"/ <path fill="${main}" d="M 4 0h2v2hTvT"/ <path fill="${subColor}" d="M 6 0h2v2hTvT"/ <path fill="${main}" d="M 8 0h2v2hTvT"/ <path fill="${subColor}" d="M 10 0h2v2hTvT"/ <path fill="${main}" d="M 12 0h2v2hTvT"/ <path fill="${subColor}" d="M 14 0h2v2hTvT"/ <path fill="${subColor}" d="M 0 2h2v2hTvT"/ <path fill="${main}" d="M 2 2h2v2hTvT"/ <path fill="${subColor}" d="M 4 2h2v2hTvT"/ <path fill="${main}" d="M 6 2h2v2hTvT"/ <path fill="${subColor}" d="M 8 2h2v2hTvT"/ <path fill="${main}" d="M 10 2h2v2hTvT"/ <path fill="${subColor}" d="M 12 2h2v2hTvT"/ <path fill="${main}" d="M 14 2h2v2hTvT"/ <path fill="${main}" d="M 0 4h2v2hTvT"/ <path fill="${subColor}" d="M 2 4h2v2hTvT"/ <path fill="${main}" d="M 4 4h2v2hTvT"/ <path fill="${subColor}" d="M 6 4h2v2hTvT"/ <path fill="${main}" d="M 8 4h2v2hTvT"/ <path fill="${subColor}" d="M 10 4h2v2hTvT"/ <path fill="${main}" d="M 12 4h2v2hTvT"/ <path fill="${subColor}" d="M 14 4h2v2hTvT"/ <path fill="${subColor}" d="M 0 6h2v2h2vTh2v2h2vTh2v2h2vTh2v2h2v8hN6vN0"/ <path fill="${main}" d="M 2 6h2v2hTvT"/ <path fill="${main}" d="M 6 6h2v2hTvT"/ <path fill="${main}" d="M 10 6h2v2hTvT"/ <path fill="${main}" d="M 14 6h2v2hTvT"/`
  }

  // const sub = '#e2cc9c'
  const sub = '#f9ede5'
  // const main = '#7d551c'
  const main = '#74645a'

  const svgData = {
    't': { svg: tree, color: '#0d8799' },
    'w': { svg: tree, color: '#0d8799' },
    'o': { svg: flowers, color: randomColor },
    'd': { svg: buildingCorner, color: main, subColor: sub },
    's': { svg: buildingCorner, color: main, subColor: sub, rotate: 90 },
    'bt': { svg: buildingCorner, color: main },
    'br': { svg: buildingCorner, color: main, rotate: 90 },
    'bb': { svg: buildingCorner, color: main, rotate: 180 },
    'bl': { svg: buildingCorner, color: main, rotate: 270 },
    'bx': { svg: roofTopBottomCorner, color: main, subColor: '#0d8799' },
    'by': { svg: roofTopBottomCorner, color: main, subColor: '#0d8799', flip: 'h' },
    'rr': { svg: roofTopBottomCorner, color: main, subColor: sub },
    'rl': { svg: roofTopBottomCorner, color: main, subColor: sub, flip: 'h' },
    'rt': { svg: roofTopBottomCorner, rotate: 180, color: main, subColor: sub },
    'ry': { svg: roofTopBottomCorner, rotate: 180, color: main, subColor: sub, flip: 'h' },
    'g': { svg: roofCorner, color: main, subColor: sub },
    'y': { svg: roofCorner, color: main, subColor: sub, flip: 'h' },
    'p': { svg: plain },
    'rp': { svg: plain, subColor: sub },
    'do': { svg: door, color: main },
    'wi': { svg: roundWindow, color: main },
    'sw': { svg: squareWindow, color: main },
    'sl': { svg: sideSquareWindow, color: main },
    'sr': { svg: sideSquareWindow, color: main, flip: 'h' },
    'nw': { svg: noSideWindow, color: main },
    'nr': { svg: noSideWindow, color: main, flip: 'h' },
    'at': { svg: plainEdge, color: main  },
    'ar': { svg: plainEdge, color: main, rotate: 90 },
    'ab': { svg: plainEdge, color: main, rotate: 180 },
    'al': { svg: plainEdge, color: main, rotate: 270 },
    'rc': { svg: roofCurve, color: main, subColor: sub },
    'pt': { svg: plainEdge, color: main, subColor: sub },
    'pr': { svg: plainEdge, color: main, subColor: sub, rotate: 90 },
    'pb': { svg: plainEdge, color: main, subColor: sub, rotate: 180 },
    'pu': { svg: plainEdge, color: main, subColor: sub, rotate: 270 },
    'b': { svg: plain, subColor: '#a2fcf0' },
    'bd': { svg: plain, subColor: '#0d8799' },
    'r': { svg: river, animation: riverAnim },
    'rh': { svg: river, rotate: 90, animation: riverAnim },
    'ra': { svg: riverCurve, animation: riverCurveAnim },
    'rb': { svg: riverCurve, rotate: 90, animation: riverCurveAnim },
    'rd': { svg: riverCurve, rotate: 180, animation: riverCurveAnim },
    're': { svg: riverCurve, rotate: 270, animation: riverCurveAnim },
    'la': { svg: ladder, color: main, subColor: sub },
    'c': { svg: checkered, color: '#a2e8fc' },
    'e': { svg: exit, color: '#0d8799', subColor: '#a2fcf0' }
  }
  // const svgAnimFrames = {
  //   'ra': { svg: riverCurve },
  //   'rb': { svg: riverCurve, rotate: 90 },
  //   'rd': { svg: riverCurve, rotate: 180 },
  //   're': { svg: riverCurve, rotate: 270 }
  // }



  let cursorType = 'pen_cursor'
  let canDraw = false
  let erase = false
  

  const grids = document.querySelectorAll('.grid')
  const palettes = document.querySelectorAll('.palette')
  const cursor = document.querySelector('.cursor')
  const copyGrid = document.querySelector('.copy_grid')
  
  // button
  const alts = document.querySelectorAll('.alt')
  const copyButtons = document.querySelectorAll('.copy') 
  const indexToggleButton = document.querySelector('.display_index')
  const buttons = document.querySelectorAll('button')

  // input
  const cellSizeInputs = document.querySelectorAll('.cell_size')
  const rowInputs = document.querySelectorAll('.row')
  const columnInputs = document.querySelectorAll('.column')
  const letterInput = document.querySelector('.letter')
  const codesBox = document.querySelectorAll('.codes')
  const indexIndicator = document.querySelector('.index_indicator')
  const codes = {
    0: [],
    // 1: []
  }


  const compress = value =>{
    const originalArray = value.split(',')
    let count = 0
    const record = []

    originalArray.forEach((letter,i)=>{
      const next = i > originalArray.length ? '' : originalArray[i + 1]
      count++
      if (letter === next) return
      record.push([letter,count])
      count = 0 
    })

    return record.map(x=> x[0] + x[1])
  }


  const decompress = value =>{
    const output = []
    value.split(',').forEach(x=>{
      const letter = x.split('').filter(y=>y * 0 !== 0).join('')
      const repeat = x.split('').filter(y=>y * 0 === 0).join('')
      for (let i = 0; i < repeat; i++){
        output.push(letter)
      }
    })
    return output
  }
  
  const populateWithSvg = (key,target) =>{
    if (svgData[key]){
      const { svg, color, subColor, rotate, flip, animation } = svgData[key]
      let colorAction = ''
      colorAction = typeof(color) === 'function' ? color() : color

      const svgContent = `
      ${animation ? 
    `
        ${svgWrapper(
    decode(subColor ? animation(subColor) : animation()),
    color ? colorAction : '',
    rotate ? rotate : 0,
    flip ? flip : null,
    'svg_anim_wrap' 
  )}
  `
    : ''
}
          ${svgWrapper(
    decode(subColor ? svg(subColor) : svg()),
    color ? colorAction : '',
    rotate ? rotate : 0,
    flip ? flip : null,
    'svg_wrap' 
  )}  
      `

      target.innerHTML = svgContent
    } 
  }
  


  const populatePalette = () =>{
    const keys = Object.keys(svgData)

    palettes[0].innerHTML = keys.map(d=>`<div class="palette_cell" data-key="${d}"></div>`).join('')

    const paletteCells = document.querySelectorAll('.palette_cell')
    
    keys.forEach((key,i)=>{
      populateWithSvg(key,paletteCells[i]) 
    })

    paletteCells.forEach(palette=>{
      palette.addEventListener('click',(e)=>{
        letterInput.value = e.target.dataset.key
      })
    })
    
  }

  populatePalette()


  const updateCodesDisplay = (box,arr) =>{
    box.value = `${arr.map(ele=>ele).join(',')}`
    window.location.hash = `${columnInputs[0].value}#${rowInputs[0].value}#${compress(codesBox[0].value).join('-')}`
  }

  
  //draw
  const drawMap = e =>{
    if (selectCopy) return
    const index = e.target.dataset.cell
    const value = erase ? 'b' : letterInput.value
    codes[0][index] = value
    e.target.innerHTML = value
    updateCodesDisplay(codesBox[0],codes[0])
  }


  const drawWithImage = e =>{
    if (selectCopy) return
    const index = e.target.dataset.cell
    const value = erase ? 'b' : letterInput.value
    codes[0][index] = value

    updateCodesDisplay(codesBox[0],codes[0])

    if (svgData[value] && !erase)  {
      populateWithSvg(value,e.target) 
    } else {
      e.target.innerHTML = ''
    }
    // console.log('error',e.target)
  }


  const continuousDraw = (e,action) =>{
    if (!canDraw) return
    action(e)
  }
  
  


  const addCodeDraw = clear =>{
    const mapCells = document.querySelectorAll('.map_cell')
    mapCells.forEach(mapCell=>{
      mapCell.addEventListener('click',(e)=>drawMap(e))
      mapCell.addEventListener('mousemove',(e)=>continuousDraw(e,drawMap))
    })
    if (clear) updateCodesDisplay(codesBox[0],codes[0])
  }

  const generateMap = clear =>{
    const mapGenCells = document.querySelectorAll('.map_gen_cell')

    //TODO
    // add way to display event in the map
    if (mapData[indexIndicator.value]) console.log(mapData[indexIndicator.value].events)

    mapGenCells.forEach((mapGenCell,i)=>{

      if (svgData[codes[0][i]]) populateWithSvg(codes[0][i],mapGenCell) 
      if (codes[0][i] === 'v') mapGenCell.innerHTML = 'x'
      // if (codes[0][i] === 'b') mapGenCell.innerHTML = '-'
      
      mapGenCell.addEventListener('click',(e)=>drawWithImage(e))
      mapGenCell.addEventListener('mousemove',(e)=>continuousDraw(e,drawWithImage))


    })
    if (clear) updateCodesDisplay(codesBox[0],codes[0])  
  }

  const generateFromCode = () =>{
    createGridCells(
      rowInputs[0].value,
      columnInputs[0].value,
      cellSizeInputs[0].value,
      0,
      'map_gen_cell',
      false
    )
    createGridCells(
      rowInputs[0].value,
      columnInputs[0].value,
      cellSizeInputs[0].value,
      1,
      'map_cell',
      false
    ) 

    codes[0] = codesBox[0].value.split(',')
    const mapCells = document.querySelectorAll('.map_cell')
    codesBox[0].value.split(',').forEach((ele,i)=>{
      if (!mapCells[i]) return
      mapCells[i].innerHTML = ele
    })
    generateMap(false)
  }

  const copyText = box =>{
    box.select()
    box.setSelectionRange(0, 99999) // For mobile devices 
    document.execCommand('copy')
  }

  const createGridCells = (row,column,cellSize,index,cellStyle,clear) =>{
    const arr = new Array(row * column).fill('')
    grids[index].style.width = `${column * cellSize}px`
    grids[index].style.height = `${row * cellSize}px`
    grids[index].innerHTML = arr.map((_ele,i)=>{
      return `
        <div 
          class="${cellStyle}"
          index="${i}"
          style="
            width:${cellSize}px;
            height:${cellSize}px;
            font-size:${cellSize}px;
            line-height:${cellSize}px;
          "
          data-cell=${i}
        >
        </div>
        `
    }).join('')
    addCodeDraw(clear)
  }
  

  const createGrid = (index,cellStyle) =>{
    row = rowInputs[index].value ? rowInputs[index].value : 50
    column = columnInputs[index].value ? columnInputs[index].value : 50
    cellSize = cellSizeInputs[index].value ? cellSizeInputs[index].value : 10
    createGridCells(row,column,cellSize,index,cellStyle,true)
    codes[0] = new Array(row * column).fill('')
    codesBox[0].value = new Array(row * column).fill('')
  }
  
  // eventlistener
  const toggleGrid = () =>{
    grids.forEach(grid=>grid.classList.toggle('grid_hide'))
  }
  
  const toggleIndex = () =>{
    const mapGenCells = document.querySelectorAll('.map_gen_cell')
    mapGenCells.forEach(grid=>grid.classList.toggle('index_display'))
  }

  cellSizeInputs[0].addEventListener('change',()=>cellSize = cellSizeInputs[0].value)
  // rowInputs[0].addEventListener('change',()=>row = rowInputs[0].value)
  rowInputs[0].addEventListener('change',()=>{
    const newRow = +rowInputs[0].value
    const diff = Math.abs(newRow - row) 
    codesBox[0].value = newRow > row
      ?  [...codes[0], ...Array(diff * column).fill('transparent')]
      :  codes[0].slice(0, codes[0].length - (diff * column))
    row = newRow
    codes[0] = codesBox[0].value
    generateFromCode()
    // console.log('row', row)
  })
  // columnInputs[0].addEventListener('change',()=>column = columnInputs[0].value)
  columnInputs[0].addEventListener('change',()=>{
    const newColumn = +columnInputs[0].value
    const updatedCodes = [[]]
    let count = 0
    let index = 0
    codes[0].forEach(code =>{
      if (count === +column) {
        count = 0
        index++
        updatedCodes.push([])
      }
      count++
      updatedCodes[index].push(code)
    })

    codesBox[0].value = updatedCodes.map(codes=>{
      const diff = Math.abs(newColumn - column) //TODO adjust arrays
      if (newColumn > column){
        return [...codes, ...Array(diff).fill('transparent')]
      } else {
        return codes.slice(0, codes.length - diff)
      }
    }).join(',')

    // prev[0].column = column
    column = newColumn
    codes[0] = codesBox[0].value
    generateFromCode()
    // console.log('column',column)
  })



  copyButtons.forEach((copyButton,i)=>{
    copyButton.addEventListener('click',()=>copyText(codesBox[i]))
  })

  codesBox[0].addEventListener('change',()=>{
    codesBox[1].value = compress(codesBox[0].value)
  })

  codesBox[1].addEventListener('change',()=>{   
    codesBox[0].value = decompress(codesBox[1].value)
  })




  indexToggleButton.addEventListener('click', toggleIndex)

  grids.forEach(grid=>{
    grid.addEventListener('mousedown',()=>canDraw = true)
    grid.addEventListener('mouseup',()=>canDraw = false)
    grid.addEventListener('mouseleave',()=>canDraw = false)

    grid.addEventListener('mouseenter',()=>cursor.classList.add(cursorType))
    grid.addEventListener('mouseleave',()=>cursor.classList.remove(cursorType))
  })

  copyGrid.addEventListener('mouseenter',()=>cursor.classList.add(cursorType))
  copyGrid.addEventListener('mouseleave',()=>cursor.classList.remove(cursorType))


  // enable grid creation with buttons

  



  const handleCursor = e =>{
    cursor.style.top = `${e.pageY}px`
    cursor.style.left = `${e.pageX}px`
  }
  window.addEventListener('mousemove', handleCursor)


  alts.forEach(button=>{
    button.addEventListener('mouseover',(e)=>{
      cursor.childNodes[0].innerHTML = e.target.dataset.alt
    })
    button.addEventListener('mouseleave',()=>{
      cursor.childNodes[0].innerHTML = ''
    })
  })


  // reads from url
  const query = window.location.hash
  console.log(query)
  if (query){
    const queryArray = query.split('#')
    row = queryArray[2]
    column = queryArray[1]
    rowInputs[0].value = row
    columnInputs[0].value = column

    codes[0] = decompress(queryArray[3].replaceAll('-',','))
    codesBox[0].value = codes[0]
    if (queryArray[4]) indexIndicator.value = queryArray[4]
    generateFromCode()
  }

  //* map links
  
  const mapLinks = document.querySelector('.map_link')
  mapLinks.innerHTML = mapData.map(map=>{
    return `
      <div class="map_link_cell">
        ${map.name}
      </div>
    `
  }).join('')

  const mapLinkCells = document.querySelectorAll('.map_link_cell')

  mapLinkCells.forEach((link,i)=>{
    link.addEventListener('click',()=>{
      const { iWidth, iHeight, map } = mapData[i]
      const url = `${iWidth}#${iHeight}#${map.replaceAll(',','-')}#${i}`
      window.location.hash = url      
      location.reload(true)
    })
  })






  //todo copy

  const copyData = {
    index: null,
    data: [],
    width: null,
    height: null,
  }
  
  let copyState
  let moveState
  let copyBoxCreated
  let copyBox
  let copyGrids
  let copied
  let isCut
  let prevX
  let prevY
  const defaultPos = {
    top: null,
    left: null,
    cell: null
  }

  const calcX = cell =>{
    return cell % column
  } 
  
  const calcY = cell =>{
    return Math.floor(cell / column)
  }

  const rounded = i =>{
    return ~~(i / cellSize) 
  }

  const createCopyGrids = (row,column,cellSize,cellStyle) =>{
    const arr = new Array(row * column).fill('')
    copyGrid.style.width = `${column * cellSize}px`
    copyGrid.style.height = `${row * cellSize}px`
    copyGrid.style.marginTop = '100px'
    copyGrid.style.marginBottom = `-${(row * cellSize) + 100}px`
    copyGrid.innerHTML = arr.map((_ele,i)=>{
      return `
        <div 
          class="${cellStyle}"
          style="
            width:${cellSize}px;
            height:${cellSize}px;
          "
          data-cell=${i}
        >
        </div>
        `
    }).join('')
    copyGrids = document.querySelectorAll(`.${cellStyle}`)

    copyGrids.forEach((grid,i)=>{
      grid.addEventListener('click',(e)=>{
        if (!copyBoxCreated){
          copyBox = document.createElement('div')
          copyBox.classList.add('copy_box')
          copyGrid.append(copyBox)
          copyBoxCreated = true
          copyBox.style.width = `${cellSize}px`
          copyBox.style.height = `${cellSize}px`
          
          defaultPos.top = e.target.offsetTop
          defaultPos.left = e.target.offsetLeft
          defaultPos.defPos = i
          prevX = i % column * cellSize
          prevY = Math.floor(i / column)
          // defaultPos.defX = prevX

          copyBox.style.top = `${defaultPos.top}px`
          copyBox.style.left = `${defaultPos.left}px`
        }
      })
    })
  }

  copyGrid.addEventListener('mousedown', ()=> copyState = true)
  copyGrid.addEventListener('mouseup', ()=> {
    copyState = false
    if (copyBox){
      defaultPos.top = copyBox.offsetTop
      defaultPos.left = copyBox.offsetLeft
    }
  })

  copyGrid.addEventListener('mousemove',(e)=>{     
    if (copyState && !moveState) {
      const next = e.target.dataset.cell
      const newX = calcX(next)
      const newY = calcY(next)
      const { defPos, top, left } = defaultPos
      
      if (!copyBox) return
      if (newX !== prevX && newY === prevY) {
        if (calcX(defPos) > newX){
          const newLeft = left - ((calcX(defPos) - newX) * cellSize)
          copyBox.style.left = `${newLeft}px`
          const newWidth = (calcX(defPos) - newX + 1) 
          copyBox.style.width = `${newWidth * cellSize}px`
        } else {
          const newWidth = (newX - calcX(defPos) + 1)
          copyData.width = newWidth
          copyBox.style.width = `${newWidth * cellSize}px`
          copyBox.style.left = `${left}px`
        }
        prevX = newX
      } else if (newY !== prevY) {
        if (calcY(defPos) > newY){ 
          const newTop = top - ((calcY(defPos) - newY) * cellSize)
          copyBox.style.top = `${newTop}px`
          const newHeight = (calcY(defPos) - newY + 1)
          copyBox.style.height = `${newHeight * cellSize}px`
        } else {
          const newHeight = (newY - calcY(defPos) + 1)
          copyData.height = newHeight
          copyBox.style.height = `${newHeight * cellSize}px`
          copyBox.style.top = `${top}px`
        }
        prevY = newY
      } 
      
      // copy selected area
      const x = copyBox.offsetLeft / cellSize
      const y = copyBox.offsetTop / cellSize
      copyData.index = returnSelectedCells((y * column) + x)
      // console.log('index', copyData.index, 'prevY',prevY, 'prevX', prevX)
      // copySelection()
    }     
  })


  const returnSelectedCells = (firstCell, roundedX, roundedY) =>{
    if (copyBox && !copied){
      copyBox.style.justifyContent = 'flex-end'
      copyBox.style.alignItems = 'flex-end'
    }
    let width = copyBox ? copyBox.style.width.replace('px','') / cellSize : ''
    let height = copyBox ? copyBox.style.height.replace('px','') / cellSize : ''
    const selection = []

    if (roundedX < 0) width += roundedX // adjusts width if selection is beyond left edge of copyBox
    if (roundedY < 0) height += roundedY // adjusts height if selection is beyond top edge of copyBox 

    // adjusts width if selection is beyond right edge of copyBox
    if (roundedX + width > column) {
      if (!copied) copyBox.style.justifyContent = 'flex-start'
      width -= Math.abs((roundedX + width) - column) 
    }
    // adjust height if selection is beyond bottom edge of copyBox
    if (roundedY + height > row) {
      if (!copied) copyBox.style.alignItems = 'flex-start'
      height -= Math.abs((roundedY + height) - row) 
    }

    for (let a = firstCell; a < firstCell + (height * column); a += +column){
      for (let b = a; b < (a + width); b++){
        selection.push(b) 
      }
    }
    
    if (!copied){
      const activeArea = document.querySelector('.active_area')
      if (!activeArea) {
        copyBox.innerHTML = `
      <div   
      class="active_area"
      style="
      width:${width * cellSize}px;
      height:${height * cellSize}px;
      ">
      </div>
    `
      } else {
        activeArea.style.width = `${width * cellSize}px`
        activeArea.style.height = `${height * cellSize}px`
      }
      // copyData.activeArea = selection
    }
    
    return selection
  }


  const copySelectionToCopyBox = cut =>{
    if (copyData.data.length) return
    const activeArea = document.querySelector('.active_area')
    if (!activeArea) return
    activeArea.innerHTML = copyData.index.map(()=>{
      return `
        <div   
        class="active_cell"
        style="
        width:${cellSize}px;
        height:${cellSize}px;
        ">
        </div>
      `
    }).join('')
    
    const activeCells = document.querySelectorAll('.active_cell')
    activeCells.forEach((area,i)=>{
      const index = copyData.index[i]
      if (svgData[codes[0][index]]) populateWithSvg(codes[0][index],area) 
      if (codes[0][index] === 'v') area.innerHTML = 'x'
    })

    copyData.index.forEach((index,i)=>{
      copyData.data[i] = codesBox[0].value.split(',')[index]
    })

    if (cut){
      //* delete original
      codes[0] = codesBox[0].value.split(',').map((grid,i)=>{  //TODO it becomes copy if we remove this bit
        if (copyData.index.some(data=> data === i)) console.log('test',grid) 
        return copyData.index.some(data=> data === i) ? 'x' : grid
      })
      codesBox[0].value = codes[0]
      isCut = true

      document.querySelectorAll('.map_gen_cell').forEach((cell,i)=>{
        // if (svgData[codes[0][i]]) populateWithSvg(codes[0][i],cell) 
        // if (codes[0][i] === 'v') cell.innerHTML = 'x'
        if (copyData.index.some(data=> data === i)) cell.innerHTML = 'x'
      })
    } 
    copied = true
    
  
    copyBox.style.top = `${copyBox.offsetTop + activeArea.offsetTop}px`
    copyBox.style.left = `${copyBox.offsetLeft + activeArea.offsetLeft}px`
    copyBox.style.width = activeArea.style.width
    copyBox.style.height = activeArea.style.height
    // updateCode()

    moveSelection()
  }

  const paste = () =>{
    if (!copyData.data.length) return
    console.log('copydata', copyData.data)

    copyData.index.forEach((index,i)=>{
      if (copyData.data[i] === 'x') return
      codes[0][index] = copyData.data[i]
    })
    codesBox[0].value = codes[0]

    document.querySelectorAll('.map_gen_cell').forEach((cell,i)=>{
      // cell.style.backgroundColor = codes[0][i]
      if (svgData[codes[0][i]]) populateWithSvg(codes[0][i],cell) 
      if (codes[0][i] === 'v') cell.innerHTML = 'x'
    })

    if (isCut){
      handleSelect()
    } 
    // updateCode()
  }


  //TODO move
  const moveSelection = () =>{
    // document.querySelector('.move_selection').classList.add('display_none')
    moveState = true
    cursorType = 'motion_cursor'
    copyBox.classList.toggle('move')
    copyGrid.classList.toggle('fix')
    let newX
    let newY
    const onDrag = e => {
      copyBox.style.transtion = '0s'
      newX = copyBox.offsetLeft + e.movementX
      newY = copyBox.offsetTop + e.movementY
      copyBox.style.left = `${newX}px`
      copyBox.style.top = `${newY}px`
    }

    const onLetGo = () => {
      // adjustments made here to ensure 'firstcell' is within selection.
      // this needs to be done because numbers continue to next row.
      const roundedY = rounded(newY) > 0 ? rounded(newY) : 0
      const roundedX = rounded(newX) > 0 ? rounded(newX) : 0
  
      copyData.width = copyBox.style.width.replace('px','') / cellSize,
      copyData.height = copyBox.style.height.replace('px','') / cellSize,
      copyData.index = returnSelectedCells((roundedY * column) + roundedX, rounded(newX), rounded(newY))

      codesBox[1].value = copyData.index.join(',')
      if (copyData.data.length) codesBox[1].value = copyData.index.join(',') + '-' + copyData.data.join(',')

      copyBox.style.left = `${rounded(newX) * cellSize}px`
      copyBox.style.top = `${rounded(newY) * cellSize}px`

      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onLetGo)
    }
    const onGrab = () => {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', onLetGo)
    }
    copyBox.addEventListener('mousedown', onGrab)
  }

    
  const handleSelect = () =>{ //TODO needs refactor since it doesn't work when copyBox has been made once
    selectCopy = !selectCopy
    copyData.data.length = 0
    if (copyBox) copyBox.classList.remove('move')
    createCopyGrids(
      row,
      column,
      cellSize,
      'copy_cell'
    )
    copyGrid.classList.toggle('active')
    copyGrid.classList.remove('fix')
    // copyBox = null
    copyBoxCreated = false
    moveState = false
    copied = false
    isCut = false
    cursorType = 'pen_cursor'
    // document.querySelector('.move_selection').classList.remove('display_none')
  }
  


  //TODO to add by editing.
  // const crop = () =>{
  //   if (!copyData.index) return
  //   codesBox[0].value = codesBox[0].value = codesBox[0].value.split(',').filter((_code,i)=>{
  //     return copyData.index.find(data=> +data === i)
  //   }).join(',')
  //   column = copyData.width
  //   row = copyData.height
  //   paintCanvas()
  //   generateFromColorCode()
  //   columnInput.value = column
  //   rowInput.value = row
  // }

  // const deleteSelection = () =>{
  //   if (!copyData.index) return
  //   codesBox[0].value = codesBox[0].value = codesBox[0].value.split(',').map((code,i)=>{
  //     return copyData.index.find(data=> +data === i) 
  //       ? ''
  //       : code
  //   }).join(',')
  //   generateFromColorCode()
  // }


  buttons.forEach(b =>{
    if (b.classList.contains('create_grid')) b.addEventListener('click', (e)=>{
      const gridClass = e.target.dataset.grid_class
      const index = +e.target.dataset.index
      createGrid(index,gridClass)
    })
    if (b.classList.contains('generate')) b.addEventListener('click', generateFromCode)
    if (b.classList.contains('grid_display')) b.addEventListener('click', toggleGrid)
    if (b.classList.contains('clear')) b.addEventListener('click', (e)=>{
      erase = !erase
      e.target.classList.toggle('active')
      cursorType = erase 
        ? 'eraser_cursor' 
        : moveState 
          ? 'motion_cursor' 
          : 'pen_cursor'
    })
    if (b.classList.contains('select')) b.addEventListener('click', handleSelect)
    if (b.classList.contains('copy_selection')) b.addEventListener('click', ()=>copySelectionToCopyBox(false))
    if (b.classList.contains('cut_selection')) b.addEventListener('click', ()=>copySelectionToCopyBox(true))
    if (b.classList.contains('move_selection')) b.addEventListener('click', moveSelection)
    if (b.classList.contains('paste_selection')) b.addEventListener('click', paste)
    // if (b.classList.contains('crop_selection')) b.addEventListener('click', crop)
    // if (b.classList.contains('delete_selection')) b.addEventListener('click', deleteSelection)
  })

}

window.addEventListener('DOMContentLoaded', init)
