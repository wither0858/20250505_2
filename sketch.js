let video;
let poseNet;
let pose;
let skeleton;
let img; // 用於儲存圖片

function preload() {
  img = loadImage('UoKfhYw.png'); // 載入圖片
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded); 
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  background(0);
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y); // 計算眼睛之間的距離
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, d);
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 62);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 62);

    // 在 pose[3] 的位置顯示圖片，並根據耳朵距離縮放
    if (pose.keypoints[3]) {
      let x = pose.keypoints[3].position.x;
      let y = pose.keypoints[3].position.y;
      let earDist = dist(pose.rightEar.x, pose.rightEar.y, pose.leftEar.x, pose.leftEar.y); // 計算耳朵之間的距離
      let scaleFactor = earDist / img.width; // 計算縮放比例
      push();
      translate(x, y);
      scale(scaleFactor); // 縮放圖片
      image(img, -img.width / 2, -img.height / 2); // 將圖片中心對齊點的位置
      pop();
    }

    drawKeypoints();
    drawSkeleton();
  }
}

function drawKeypoints() {
  for (let i = 0; i < pose.keypoints.length; i++) {
    let x = pose.keypoints[i].position.x;
    let y = pose.keypoints[i].position.y;
    fill(0, 255, 0);
    ellipse(x, y, 16, 16);
  }
}

function drawSkeleton() {
  for (let i = 0; i < skeleton.length; i++) {
    let a = skeleton[i][0];
    let b = skeleton[i][1];
    strokeWeight(2);
    stroke(255, 0, 0);
    line(a.position.x, a.position.y, b.position.x, b.position.y);
  }
}