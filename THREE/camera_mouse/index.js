import * as THREE from 'three'

const width = 960
const height = 540
let rot = 0
let mouseX = 0

document.addEventListener('mousemove', (event) => {
    mouseX = event.pageX
})

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
})
renderer.setSize(width, height)
renderer.setPixelRatio(devicePixelRatio)

// シーンを作成
const scene = new THREE.Scene()

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
// カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
camera.position.set(0, 0, 1000)

// 球を作成
const geometry = new THREE.SphereGeometry(300, 30, 30)
//画像を読み込む
const loader = new THREE.TextureLoader()
const texture = loader.load('./earthmap1k.jpg')
texture.colorSpace = THREE.SRGBColorSpace
const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
})
const earthmesh = new THREE.Mesh(geometry, material)
scene.add(earthmesh)

// 平行光源
const light = new THREE.DirectionalLight(0xffffff)
light.intensity = 2 // 光の強さを倍に
light.position.set(1, 1, 1) // ライトの方向
// シーンに追加
scene.add(light)

//背景に星屑を作成
createStarField()

function createStarField() {
    //頂点情報を作成
    const vertices = []
    for (let i = 0; i < 1000; i++) {
        vertices.push(
            3000 * (Math.random() - 0.5),
            3000 * (Math.random() - 0.5),
            3000 * (Math.random() - 0.5)
        )
    }

    // 形状データを作成
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
    )

    // マテリアルを作成
    const material = new THREE.PointsMaterial({
        size: 10,
        color: 0xffffff,
    })

    //物体を作成
    const mesh = new THREE.Points(geometry, material)
    scene.add(mesh)
}

// 初回実行
tick()

function tick() {
    const targetRot = (mouseX / window.innerWidth) * 360

    rot += (targetRot - rot) * 0.02 // 毎フレーム角度を0.5度ずつ足していく

    // ラジアンに変換する
    const radian = (rot * Math.PI) / 180

    // カメラを回転させる
    camera.position.x = 1000 * Math.sin(radian)
    camera.position.z = 1000 * Math.cos(radian)
    //　原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // レンダリング
    renderer.render(scene, camera)

    requestAnimationFrame(tick)
}
