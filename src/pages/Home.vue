<template>
  <!-- 输入区 -->
  <el-row :gutter="20" style="margin-top: 20px; margin-left: 20px">
    <el-col :span="4"> 
    <h3>以下单位均为mm!</h3>
    <el-form :model="form" ref="formRef" label-width="auto" style="max-width: 600px">
      <el-form-item label="墙体总长">
        <el-input v-model="form.wallWidth" />
      </el-form-item>
      <el-form-item label="层高">
        <el-input v-model="form.wallHeight"/>
      </el-form-item>
      <el-form-item label="梁高/板高">
        <el-input v-model="form.beamHeight" />
      </el-form-item>
      <el-form-item label="墙板净高">
        <el-input  v-model="form.wallPageHeight" :readonly="true"/>
      </el-form-item>
      <el-form-item label="有无洞口">
      <el-select v-model="form.selectValue" placeholder="请选择" >
        <el-option value="1" label="有" />
        <el-option value="2" label="无"/>
      </el-select>
      </el-form-item>
      <!-- 有洞口 -->
      <template v-if="form.selectValue == '1'">
        <el-form-item label="洞口类型">
        <el-select v-model="form.selectOpeningType"placeholder="请选择">
          <el-option value="3" label="门洞"/>
          <el-option value="4" label="窗洞"/>
        </el-select>
        </el-form-item>
        <!-- 门洞 -->
        <template v-if="form.selectOpeningType == '3'">
          <el-form-item label="门洞宽度">
          <el-input type="number"  v-model="form.doorWidth" />
          </el-form-item>
          <el-form-item label="门洞高度">
            <el-input type="number"  v-model="form.doorHeight" />
          </el-form-item>
          <el-form-item label="门洞距左侧距离">
            <el-input type="number"  v-model="form.doorToLeft" placeholder="在门上的矩形在其他墙段(一个)上的覆盖长度"/>
          </el-form-item>
        </template>
        <!-- 窗洞 -->
        <template v-if="form.selectOpeningType == '4'">
          <el-form-item label="窗洞宽度">
            <el-input type="number"  v-model="form.windowWidth" />
          </el-form-item>
          <el-form-item label="窗洞高度">
            <el-input type="number"  v-model="form.windowHeight" />
          </el-form-item>
          <el-form-item label="窗底部高度">
            <el-input type="number"  v-model="form.windowBottomHeight" />
          </el-form-item>
          <el-form-item label="窗距左侧距离">
            <el-input type="number"  v-model="form.windowToLeft" />
          </el-form-item>
          </template>
        </template>
      <!-- 无洞口 -->
      <template v-if="form.selectValue == '2'">
      </template>
      <el-button type="primary" @click="write">生成</el-button>   
      <el-button @click="resetForm(formRef)">重置</el-button>
    </el-form>
  </el-col>
  <el-col :span="20">
  <!-- 展示区 -->
    <canvas id="c" style="border: 1px solid #ccc;"></canvas>
    <el-button type="primary" @click="save">保存</el-button>
    <!-- <canvas :width="form.wallWidth / allReduce" :height="(form.wallHeight - form.beamHeight)/allReduce"  id="c" style="border: 1px solid #ccc;"></canvas> -->
  </el-col>
  </el-row>
</template>

<script setup lang="ts" name="Home">
  import { ref, watchEffect, reactive,watch } from 'vue';
  import { fabric } from 'fabric'
  import {onMounted} from 'vue'
  import type { FormInstance } from 'element-plus'
  import { animateScrollTo } from 'element-plus/es/utils/index.mjs';

  const formRef = ref();
  let canvas = ref<fabric.Canvas | null>(null) //ref(fabric.Canvas)
  onMounted(()=>{
    // canvas.value = new fabric.Canvas('c') // 这里传入的是canvas的id
    canvas.value = new fabric.Canvas('c', {
      width: form.wallWidth / allReduce.value,
      height: (form.wallHeight - form.beamHeight)/allReduce.value
    });
    // canvas.value.setZoom(0.1)
  })

  function write() {
    
    //有洞口
    if(form.selectValue == '1'){
      //门洞
      if(form.selectOpeningType == '3'){
        //门洞左边的墙
        // 计算总共需要生成多少个宽度为600的区域
        // const numFullRects = (Math.floor(form.doorToLeft / 600)-1);

        // // 生成宽度为600的区域
        // for (let i = 0; i < numFullRects; i++) {
        //   const rectWidth = 600;
        //   const rect = new fabric.Rect({
        //     top: (form.wallHeight - form.wallPageHeight - form.beamHeight) / allReduce.value,
        //     left: left / allReduce.value,
        //     width: rectWidth / allReduce.value,
        //     height: form.wallPageHeight / allReduce.value,
        //     fill: 'transparent', // 明确设置填充为透明
        //     stroke: 'black', // 添加黑色边框
        //     strokeWidth: 1 // 设置边框宽度
        //   });
        //   // fill: 'rgba(173, 216, 230, 0.5)',
        //   //   stroke: 'black', // 添加黑色边框
        //   //   strokeWidth: 1 // 设置边框宽度
        //   // // 添加文本标注宽度属性
        //   const text = new fabric.Text(`${rectWidth}mm`, {
        //     fontSize: 12,
        //     left: (left + rectWidth / 8) / allReduce.value,
        //     top: (form.wallHeight - form.wallPageHeight + 100 - form.beamHeight) / allReduce.value, // 放在块的上方并稍微偏移
        //     fill: 'black'
        //   });

        //   left += rectWidth;
        //   // color = !color;

        //   canvas.value?.add(rect);
        //   // canvas.value?.add(text); // 添加文本标注
        //   canvas.value?.sendToBack(rect);
        // }

        // // 如果有余数区域
        // const remainderWidth = form.doorToLeft % 600;
        // if (remainderWidth > 0) {
        //   const rect = new fabric.Rect({
        //     top: (form.wallHeight - form.wallPageHeight - form.beamHeight) / allReduce.value,
        //     left: left / allReduce.value,
        //     width: remainderWidth / allReduce.value,
        //     height: form.wallPageHeight / allReduce.value,
        //     fill: 'transparent', // 明确设置填充为透明
        //     stroke: 'black', // 添加黑色边框
        //     strokeWidth: 1 // 设置边框宽度
        //   });

        //   // 添加文本标注余数区域宽度属性
        //   const text = new fabric.Text(`${remainderWidth}mm`, {
        //     fontSize: 12,
        //     left: (left + remainderWidth / 8) / allReduce.value,
        //     top: (form.wallHeight - form.wallPageHeight + 100 - form.beamHeight) / allReduce.value, // 放在块的上方并稍微偏移
        //     fill: 'black'
        //   });

        //   left += remainderWidth;
        //   canvas.value?.add(rect);
        //   canvas.value?.add(text); // 添加文本标注
        //   canvas.value?.sendToBack(rect);
        // }

        // // 再生成宽度为600的区域
        // const lastFullRect = new fabric.Rect({
        //   top: (form.wallHeight - form.wallPageHeight - form.beamHeight) / allReduce.value,
        //   left: left / allReduce.value,
        //   width:  600 / allReduce.value,
        //   height: form.wallPageHeight / allReduce.value,
        //   fill: 'transparent', // 明确设置填充为透明
        //   stroke: 'black', // 添加黑色边框
        //   strokeWidth: 1 // 设置边框宽度
        // });
        // left += 600;
        // canvas.value?.add(lastFullRect)
        // console.log("addwall", canvas)

        //门
        paintWalls(form.doorToLeft)
        
        //门洞
        const rect1 = new fabric.Rect({
          top: (form.wallHeight - form.doorHeight - form.beamHeight) / allReduce.value,
          left: left / allReduce.value,
          width: form.doorWidth / allReduce.value, 
          height: form.doorHeight / allReduce.value, 
          fill: 'transparent', // 明确设置填充为透明
          stroke: 'black', // 添加黑色边框
          strokeWidth: 1 // 设置边框宽度
        });
        canvas.value?.add(rect1);
        //门板区域
        const coverLength = form.coverLength;
        const rect2 = new fabric.Rect({
          top: (form.wallHeight - form.doorHeight - form.wallSingleWidth - form.beamHeight) / allReduce.value,
          left: (left - coverLength) / allReduce.value,
          width: (parseFloat(coverLength.toString()) + parseFloat(coverLength.toString()) + parseFloat(form.doorWidth.toString())) / allReduce.value, 
          height: form.wallSingleWidth / allReduce.value, 
          fill: 'white', // 明确设置填充
          stroke: 'black', // 添加黑色边框
          strokeWidth: 1 // 设置边框宽度
        });
        canvas.value?.add(rect2);
        canvas.value?.bringToFront(rect2)
        //门上部分
        paintDoorOrWindowWalls(0,form.doorWidth,form.wallPageHeight - form.doorHeight - form.wallSingleWidth)
        //门右边的墙
        paintWalls(form.wallWidth - form.doorToLeft - form.doorWidth)
      }
      //窗洞
      if(form.selectOpeningType == '4'){
        //窗户洞左边的墙
        // // 计算总共需要生成多少个宽度为600的区域
        // const numFullRects3 = (Math.floor(form.windowToLeft / 600)-1);

        // // 生成宽度为600的区域
        // for (let i = 0; i < numFullRects3; i++) {
        //   const rectWidth = 600;
        //   const rect = new fabric.Rect({
        //     top: (form.wallHeight - form.wallPageHeight - form.beamHeight) / allReduce.value,
        //     left: left / allReduce.value,
        //     width: rectWidth / allReduce.value,
        //     height: form.wallPageHeight / allReduce.value,
        //     fill: 'transparent', // 明确设置填充为透明
        //     stroke: 'black', // 添加黑色边框
        //     strokeWidth: 1 // 设置边框宽度
        //   });

        //   left += rectWidth;
        //   // color = !color;

        //   canvas.value?.add(rect);
        //   // canvas.value?.add(text); // 添加文本标注
        //   canvas.value?.sendToBack(rect);
        // }

        // // 如果有余数区域
        // const remainderWidth2 = form.windowToLeft % 600;
        // if (remainderWidth2 > 0) {
        //   const rect = new fabric.Rect({
        //     top: (form.wallHeight - form.wallPageHeight - form.beamHeight) / allReduce.value,
        //     left: left / allReduce.value,
        //     width: remainderWidth2 / allReduce.value,
        //     height: form.wallPageHeight / allReduce.value,
        //     fill: 'transparent', // 明确设置填充为透明
        //     stroke: 'black', // 添加黑色边框
        //     strokeWidth: 1 // 设置边框宽度
        //   });

        //   // 添加文本标注余数区域宽度属性
        //   const text = new fabric.Text(`${remainderWidth2}mm`, {
        //     fontSize: 12,
        //     left: (left + remainderWidth2 / 8) / allReduce.value,
        //     top: (form.wallHeight - form.wallPageHeight + 100 - form.beamHeight) / allReduce.value, // 放在块的上方并稍微偏移
        //     fill: 'black'
        //   });

        //   left += remainderWidth2;
        //   canvas.value?.add(rect);
        //   canvas.value?.add(text); // 添加文本标注
        //   canvas.value?.sendToBack(rect);
        // }

        // // 再生成宽度为600的区域
        // const lastFullRect = new fabric.Rect({
        //   top: (form.wallHeight - form.wallPageHeight - form.beamHeight) / allReduce.value,
        //   left: left / allReduce.value,
        //   width: 600 / allReduce.value,
        //   height: form.wallPageHeight / allReduce.value,
        //   fill: 'transparent', // 明确设置填充为透明
        //   stroke: 'black', // 添加黑色边框
        //   strokeWidth: 1 // 设置边框宽度
        // });
        // left += 600;
        // // color = !color;
        // canvas.value?.add(lastFullRect);
        // canvas.value?.sendToBack(lastFullRect);
        // console.log("addwall", canvas)

        //窗户
        paintWalls(form.windowToLeft)

        //玻璃区域
        const rect5 = new fabric.Rect({
            top: (form.wallHeight - form.windowBottomHeight - form.windowHeight - form.beamHeight)/allReduce.value,
            left: left / allReduce.value,
            width: form.windowWidth / allReduce.value, 
            height: form.windowHeight / allReduce.value,
            fill: 'transparent', // 明确设置填充为透明
            stroke: 'black', // 添加黑色边框
            strokeWidth: 1 // 设置边框宽度
        })
        canvas.value?.add(rect5)

        //玻璃上下的墙
        const firstLeft = left
        paintDoorOrWindowWalls(0,form.windowWidth,form.wallHeight - form.beamHeight -form.windowBottomHeight - form.windowHeight)
        left = firstLeft//返回原left重新绘制窗户下面的墙
        paintDoorOrWindowWalls(form.wallHeight - form.beamHeight - form.windowBottomHeight,form.windowWidth,form.windowBottomHeight)

        //窗户右边的墙
        // 计算总共需要生成多少个宽度为600的区域
        // const numFullRects5 = (Math.floor((form.wallWidth - form.windowToLeft - form.windowWidth) / 600)-1);
        // console.log("窗户右边墙的个数:",numFullRects5)
        // // 生成宽度为600的区域
        // for (let i = 0; i < numFullRects5; i++) {
        //   const rectWidth = 600;
        //   const rectRight = new fabric.Rect({
        //     top: 0 / allReduce.value,
        //     left: left / allReduce.value,
        //     width: rectWidth / allReduce.value,
        //     height: (form.wallHeight - form.beamHeight)/ allReduce.value,
        //     fill: 'transparent', // 明确设置填充为透明
        //     stroke: 'black', // 添加黑色边框
        //     strokeWidth: 1 // 设置边框宽度
        //   });
        //   left += rectWidth;
        //   canvas.value?.add(rectRight);
        //   canvas.value?.sendToBack(rectRight);
        // }

        // // 如果有余数区域
        // const remainderWidth1 = (form.wallWidth - form.windowToLeft - form.windowWidth) % 600;
        // console.log("窗户余数区域宽度",remainderWidth1)
        // if (remainderWidth1 > 0) {
        //   const rect = new fabric.Rect({
        //     top: (form.wallHeight - form.wallPageHeight - form.beamHeight) / allReduce.value,
        //     left: left / allReduce.value,
        //     width: remainderWidth1 / allReduce.value,
        //     height: form.wallPageHeight / allReduce.value,
        //     fill: 'transparent', // 明确设置填充为透明
        //     stroke: 'black', // 添加黑色边框
        //     strokeWidth: 1 // 设置边框宽度
        //   });

        //   // 添加文本标注余数区域宽度属性
        //   const text = new fabric.Text(`${remainderWidth1}mm`, {
        //     fontSize: 12,
        //     left: (left + remainderWidth1 / 8) / allReduce.value,
        //     top: (form.wallHeight - form.wallPageHeight + 100 - form.beamHeight) / allReduce.value, // 放在块的上方并稍微偏移
        //     fill: 'black'
        //   });

        //   left += remainderWidth1;
        //   canvas.value?.add(rect);
        //   canvas.value?.add(text); // 添加文本标注
        //   canvas.value?.sendToBack(rect);
        // }

        // // 再生成宽度为600的区域
        // const lastFullRect3 = new fabric.Rect({
        //     top: (form.wallHeight - form.wallPageHeight - form.beamHeight) / allReduce.value,
        //     left: left / allReduce.value,
        //     width: 600 / allReduce.value,
        //     height: form.wallPageHeight / allReduce.value,
        //     fill: 'transparent', // 明确设置填充为透明
        //     stroke: 'black', // 添加黑色边框
        //     strokeWidth: 1 // 设置边框宽度
        // });
        // left += 600;
        // canvas.value?.add(lastFullRect3);
        // canvas.value?.sendToBack(lastFullRect3);
        // console.log("addWindowWallRight", canvas)
        paintWalls(form.wallWidth - form.windowToLeft - form.windowWidth)
      }
    }
    //无洞口
    if(form.selectValue == '2'){
      const width = form.wallWidth;
      paintWalls(width)
      // if(width >= 600){//宽度大于600
      //   // 如果有余数区域
      //   const remainderWidth = width % 600;
      //   if (remainderWidth >= 200 && remainderWidth <=600) {//如果大于200
      //     // 计算总共需要生成多少个宽度为600的区域
      //     const numFullRects = (Math.floor(form.wallWidth / 600)-1);
      //     // 生成宽度为600的区域
      //     for (let i = 0; i < numFullRects; i++) {
      //       const rectWidth = 600;
      //       const rect = new fabric.Rect({
      //         top: 0 / allReduce.value,
      //         // (form.wallHeight - height - form.beamHeight)
      //         left: left / allReduce.value,
      //         width: rectWidth / allReduce.value,
      //         height: height / allReduce.value,
      //         fill: 'transparent', // 明确设置填充为透明
      //         stroke: 'black', // 添加黑色边框
      //         strokeWidth: 1 // 设置边框宽度
      //       });
      //       left += rectWidth;
      //       canvas.value?.add(rect);
      //       canvas.value?.sendToBack(rect);
      //     }

      //     const rect = new fabric.Rect({
      //       top: (form.wallHeight - height - form.beamHeight) / allReduce.value,
      //       left: left / allReduce.value,
      //       width: remainderWidth / allReduce.value,
      //       height: height / allReduce.value,
      //       fill: 'transparent', // 明确设置填充为透明
      //       stroke: 'black', // 添加黑色边框
      //       strokeWidth: 1 // 设置边框宽度
      //     });

      //     // 添加文本标注余数区域宽度属性
      //     const text = new fabric.Text(`${remainderWidth}mm`, {
      //       fontSize: 12,
      //       left: (left + remainderWidth / 8) / allReduce.value,
      //       top: (form.wallHeight - height + 100 - form.beamHeight) / allReduce.value, // 放在块的上方并稍微偏移
      //       fill: 'black'
      //     });

      //     left += remainderWidth;
      //     canvas.value?.add(rect);
      //     canvas.value?.add(text); // 添加文本标注
      //     canvas.value?.sendToBack(rect);

      //     // 再生成宽度为600的区域
      //     const lastFullRect = new fabric.Rect({
      //       top: (form.wallHeight - height - form.beamHeight) / allReduce.value,
      //       left: left / allReduce.value,
      //       width: 600 / allReduce.value,
      //       height: height / allReduce.value,
      //       fill: 'transparent', // 明确设置填充为透明
      //       stroke: 'black', // 添加黑色边框
      //       strokeWidth: 1 // 设置边框宽度
      //     });
      //     left += 600;
      //     canvas.value?.add(lastFullRect);
      //     canvas.value?.sendToBack(lastFullRect);
      //     console.log("addwall", canvas)
      //   }
      //   else{//余数小于200
      //     // 计算总共需要生成多少个宽度为600的区域
      //     const numFullRects = (Math.floor(form.wallWidth / 600)-3);
      //     if(numFullRects == -2){//左右无600
      //       sliceArea1()
      //       sliceArea2()
      //     }else if(numFullRects == -1){//一个600
      //       aSingleWall()
      //       sliceArea1()
      //       sliceArea2()
      //     }else if(numFullRects == 0){//两个600
      //       aSingleWall()
      //       sliceArea1()
      //       sliceArea2()
      //       aSingleWall()
      //     }else{//600 + slice1 + n个600 + slcie2 +600 
      //       aSingleWall()
      //       sliceArea1()
      //       for(let i = 0;i <numFullRects;i++){
      //         aSingleWall()
      //       }
      //       sliceArea2()
      //       aSingleWall()
      //     }

      //     // 生成宽度为600的区域
      //     for (let i = 0; i < numFullRects; i++) {
      //         const rectWidth = 600;
      //         const rect = new fabric.Rect({
      //           top: 0 / allReduce.value,
      //           left: left / allReduce.value,
      //           width: rectWidth / allReduce.value,
      //           height: height / allReduce.value,
      //           fill: 'transparent', // 明确设置填充为透明
      //           stroke: 'black', // 添加黑色边框
      //           strokeWidth: 1 // 设置边框宽度
      //         });
      //         left += rectWidth;
      //         canvas.value?.add(rect);
      //         canvas.value?.sendToBack(rect);
      //     }
      //   }
      // }
      // else{//宽度小于600
      //   const rect = new fabric.Rect({
      //   top: 0 / allReduce.value,
      //   left: left / allReduce.value,
      //   width: form.wallWidth / allReduce.value,
      //   height: form.wallPageHeight / allReduce.value,
      //   fill: 'transparent', // 明确设置填充为透明
      //   stroke: 'black', // 添加黑色边框
      //   strokeWidth: 1 // 设置边框宽度
      // });
      // left += form.wallWidth;
      // canvas.value?.add(rect);
      // canvas.value?.sendToBack(rect);
      // }
    }
  }
  //无洞口的墙
  function sliceArea1(totalWidth:number,top:number,height:number){//切块1
    const slice1 = (form.wallSingleWidth + totalWidth % 600)/2 - 50
    const rect1 = new fabric.Rect({
              top: top / allReduce.value,
              // (form.wallHeight - height - form.beamHeight)
              left: left / allReduce.value,
              width: slice1 / allReduce.value,
              height: height / allReduce.value,
              fill: 'transparent', // 明确设置填充为透明
              stroke: 'black', // 添加黑色边框
              strokeWidth: 1 // 设置边框宽度
            });
            // 添加文本标注余数区域宽度属性
            const text1 = new fabric.Text(`${slice1}mm`, {
              fontSize: 12,
              left: (left + (form.wallWidth % 600) / 8) / allReduce.value,
              top: (form.wallHeight - form.wallPageHeight + 100 - form.beamHeight) / allReduce.value, 
              fill: 'black'
            });
            left += slice1;
            canvas.value?.add(rect1);
            canvas.value?.add(text1);
  }
  function sliceArea2(totalWidth:number,top:number,height:number){//切块2
    const slice2 = (form.wallSingleWidth + totalWidth % 600)/2 + 50
    const rect2 = new fabric.Rect({
              top: top / allReduce.value,
              // (form.wallHeight - height - form.beamHeight)
              left: left / allReduce.value,
              width: slice2 / allReduce.value,
              height: height / allReduce.value,
              fill: 'transparent', // 明确设置填充为透明
              stroke: 'black', // 添加黑色边框
              strokeWidth: 1 // 设置边框宽度
            });
            // 添加文本标注余数区域宽度属性
            const text2 = new fabric.Text(`${slice2}mm`, {
              fontSize: 12,
              left: (left + (form.wallWidth % 600) / 8) / allReduce.value,
              top: (form.wallHeight - form.wallPageHeight + 100 - form.beamHeight) / allReduce.value, // 放在块的上方并稍微偏移
              fill: 'black'
            });
            left += slice2;
            canvas.value?.add(rect2);
            canvas.value?.add(text2);
  }
  function aSingleWall(height:number){//一块600的墙
    const rectWidth = 600;
      const rect = new fabric.Rect({
        top: 0 / allReduce.value,
        left: left / allReduce.value,
        width: rectWidth / allReduce.value,
        height: height / allReduce.value,
        fill: 'transparent', // 明确设置填充为透明
        stroke: 'black', // 添加黑色边框
        strokeWidth: 1 // 设置边框宽度
      });
      left += rectWidth;
      canvas.value?.add(rect);
      canvas.value?.sendToBack(rect);
  }
  function paintWalls(width:number){
    console.log()
  const height = form.wallPageHeight;
  const top = 0
  if(width >= 600){//宽度大于600
    // 如果有余数区域
    const remainderWidth = width % 600;
    if (remainderWidth >= 200 && remainderWidth < 600) {//如果大于200
      // 计算总共需要生成多少个宽度为600的区域
      const numFullRects = (Math.floor(width / 600)-1);
      // 生成宽度为600的区域
      for (let i = 0; i < numFullRects; i++) {
        const rectWidth = 600;
        const rect = new fabric.Rect({
          top: 0 / allReduce.value,
          // (form.wallHeight - height - form.beamHeight)
          left: left / allReduce.value,
          width: rectWidth / allReduce.value,
          height: height / allReduce.value,
          fill: 'transparent', // 明确设置填充为透明
          stroke: 'black', // 添加黑色边框
          strokeWidth: 1 // 设置边框宽度
        });
        left += rectWidth;
        canvas.value?.add(rect);
        canvas.value?.sendToBack(rect);
      }

      const rect = new fabric.Rect({
        top: (form.wallHeight - height - form.beamHeight) / allReduce.value,
        left: left / allReduce.value,
        width: remainderWidth / allReduce.value,
        height: height / allReduce.value,
        fill: 'transparent', // 明确设置填充为透明
        stroke: 'black', // 添加黑色边框
        strokeWidth: 1 // 设置边框宽度
      });

      // 添加文本标注余数区域宽度属性
      const text = new fabric.Text(`${remainderWidth}mm`, {
        fontSize: 12,
        left: (left + remainderWidth / 8) / allReduce.value,
        top: (form.wallHeight - height + 100 - form.beamHeight) / allReduce.value, // 放在块的上方并稍微偏移
        fill: 'black'
      });

      left += remainderWidth;
      canvas.value?.add(rect);
      canvas.value?.add(text); // 添加文本标注
      canvas.value?.sendToBack(rect);

      // 再生成宽度为600的区域
      const lastFullRect = new fabric.Rect({
        top: (form.wallHeight - height - form.beamHeight) / allReduce.value,
        left: left / allReduce.value,
        width: 600 / allReduce.value,
        height: height / allReduce.value,
        fill: 'transparent', // 明确设置填充为透明
        stroke: 'black', // 添加黑色边框
        strokeWidth: 1 // 设置边框宽度
      });
      left += 600;
      canvas.value?.add(lastFullRect);
      canvas.value?.sendToBack(lastFullRect);
      console.log("addwall", canvas)
    }
    else if(remainderWidth == 0){
      // 计算总共需要生成多少个宽度为600的区域
      const numFullRects = width / 600;
      // 生成宽度为600的区域
      for (let i = 0; i < numFullRects; i++) {
        const rectWidth = 600;
        const rect = new fabric.Rect({
          top: 0 / allReduce.value,
          // (form.wallHeight - height - form.beamHeight)
          left: left / allReduce.value,
          width: rectWidth / allReduce.value,
          height: height / allReduce.value,
          fill: 'transparent', // 明确设置填充为透明
          stroke: 'black', // 添加黑色边框
          strokeWidth: 1 // 设置边框宽度
        });
        left += rectWidth;
        canvas.value?.add(rect);
        canvas.value?.sendToBack(rect);
      }
    }
    else{//余数小于200
      // 计算总共需要生成多少个宽度为600的区域
      const numFullRects = (Math.floor(width / 600)-3);
      if(numFullRects == -2){//左右无600
        sliceArea1(width,top,height)
        sliceArea2(width,top,height)
      }else if(numFullRects == -1){//一个600
        aSingleWall(form.wallPageHeight)
        sliceArea1(width,top,height)
        sliceArea2(width,top,height)
      }else if(numFullRects == 0){//两个600
        aSingleWall(form.wallPageHeight)
        sliceArea1(width,top,height)
        sliceArea2(width,top,height)
        aSingleWall(form.wallPageHeight)
      }else{//600 + slice1 + n个600 + slcie2 +600 
        aSingleWall(form.wallPageHeight)
        sliceArea1(width,top,height)
        for(let i = 0;i <numFullRects;i++){
          aSingleWall(form.wallPageHeight)
        }
        sliceArea2(width,top,height)
        aSingleWall(form.wallPageHeight)
      }

      // 生成宽度为600的区域
      for (let i = 0; i < numFullRects; i++) {
          const rectWidth = 600;
          const rect = new fabric.Rect({
            top: 0 / allReduce.value,
            left: left / allReduce.value,
            width: rectWidth / allReduce.value,
            height: height / allReduce.value,
            fill: 'transparent', // 明确设置填充为透明
            stroke: 'black', // 添加黑色边框
            strokeWidth: 1 // 设置边框宽度
          });
          left += rectWidth;
          canvas.value?.add(rect);
          canvas.value?.sendToBack(rect);
      }
    }
  }
  else{//宽度小于600
    const rect = new fabric.Rect({
    top: 0 / allReduce.value,
    left: left / allReduce.value,
    width: form.wallWidth / allReduce.value,
    height: form.wallPageHeight / allReduce.value,
    fill: 'transparent', // 明确设置填充为透明
    stroke: 'black', // 添加黑色边框
    strokeWidth: 1 // 设置边框宽度
  });
  left += form.wallWidth;
  canvas.value?.add(rect);
  canvas.value?.sendToBack(rect);
  }
  }
  //门或窗户上下方的小墙
  function paintDoorOrWindowWalls(top:number,width:number,height:number){//门上的墙板区域
    if(width >= 600){//宽度大于600
      // 如果有余数区域
      const remainderWidth = width % 600;
      if (remainderWidth >= 200 && remainderWidth <=600) {//如果大于200
        // 计算总共需要生成多少个宽度为600的区域
        const numFullRects = (Math.floor(width / 600)-1);
        // 生成宽度为600的区域
        for (let i = 0; i < numFullRects; i++) {
          const rectWidth = 600;
          const rect = new fabric.Rect({
            top: top / allReduce.value,
            // (form.wallHeight - height - form.beamHeight)
            left: left / allReduce.value,
            width: rectWidth / allReduce.value,
            height: height / allReduce.value,
            fill: 'transparent', // 明确设置填充为透明
            stroke: 'black', // 添加黑色边框
            strokeWidth: 1 // 设置边框宽度
          });
          left += rectWidth;
          canvas.value?.add(rect);
          canvas.value?.sendToBack(rect);
        }

        const rect = new fabric.Rect({
          top: top / allReduce.value,
          left: left / allReduce.value,
          width: remainderWidth / allReduce.value,
          height: height / allReduce.value,
          fill: 'transparent', // 明确设置填充为透明
          stroke: 'black', // 添加黑色边框
          strokeWidth: 1 // 设置边框宽度
        });

        // 添加文本标注余数区域宽度属性
        const text = new fabric.Text(`${remainderWidth}mm`, {
          fontSize: 12,
          left: (left + remainderWidth / 8) / allReduce.value,
          top: (top + 100) / allReduce.value, // 放在块的上方并稍微偏移
          fill: 'black'
        });

        left += remainderWidth;
        canvas.value?.add(rect);
        canvas.value?.add(text); // 添加文本标注
        canvas.value?.sendToBack(rect);

        // 再生成宽度为600的区域
        const lastFullRect = new fabric.Rect({
          top: top / allReduce.value,
          left: left / allReduce.value,
          width: 600 / allReduce.value,
          height: height / allReduce.value,
          fill: 'transparent', // 明确设置填充为透明
          stroke: 'black', // 添加黑色边框
          strokeWidth: 1 // 设置边框宽度
        });
        left += 600;
        canvas.value?.add(lastFullRect);
        canvas.value?.sendToBack(lastFullRect);
        console.log("addwall", canvas)
      }
      else{//余数小于200
        // 计算总共需要生成多少个宽度为600的区域
        const numFullRects = (Math.floor(width / 600)-3);
        if(numFullRects == -2){//左右无600
          sliceArea1(width,top,height)
          sliceArea2(width,top,height)
        }else if(numFullRects == -1){//一个600
          aSingleWall(form.wallPageHeight)
          sliceArea1(width,top,height)
          sliceArea2(width,top,height)
        }else if(numFullRects == 0){//两个600
          aSingleWall(form.wallPageHeight)
          sliceArea1(width,top,height)
          sliceArea2(width,top,height)
          aSingleWall(form.wallPageHeight)
        }else{//600 + slice1 + n个600 + slcie2 +600 
          aSingleWall(form.wallPageHeight)
          sliceArea1(width,top,height)
          for(let i = 0;i <numFullRects;i++){
            aSingleWall(form.wallPageHeight)
          }
          sliceArea2(width,top,height)
          aSingleWall(form.wallPageHeight)
        }

        // 生成宽度为600的区域
        for (let i = 0; i < numFullRects; i++) {
            const rectWidth = 600;
            const rect = new fabric.Rect({
              top: top / allReduce.value,
              left: left / allReduce.value,
              width: rectWidth / allReduce.value,
              height: height / allReduce.value,
              fill: 'transparent', // 明确设置填充为透明
              stroke: 'black', // 添加黑色边框
              strokeWidth: 1 // 设置边框宽度
            });
            left += rectWidth;
            canvas.value?.add(rect);
            canvas.value?.sendToBack(rect);
        }
      }
    }
    else{//宽度小于600
      const rect = new fabric.Rect({
      top: 0 / allReduce.value,
      left: left / allReduce.value,
      width: form.wallWidth / allReduce.value,
      height: form.wallPageHeight / allReduce.value,
      fill: 'transparent', // 明确设置填充为透明
      stroke: 'black', // 添加黑色边框
      strokeWidth: 1 // 设置边框宽度
    });
    left += form.wallWidth;
    canvas.value?.add(rect);
    canvas.value?.sendToBack(rect);
    }
  }
  const save = () => {
  const canvasElement = canvas.value;
  if (!canvasElement) return;

  // 获取 data URL
  const dataURL = canvasElement.toDataURL({ format: 'image/png' });

  // 创建一个新的图片元素
  const img = new Image();
  img.src = dataURL;

  // 创建一个新的 a 标签
  const link = document.createElement('a');
  // 设置链接的 href 属性为 data URL
  link.href = dataURL;
  // 设置下载的文件名
  link.download = 'canvas.png';
  // 触发点击事件，下载图片
  link.click();
};
  // function save(){
  //   const canvas = ref<HTMLCanvasElement | null>(null);
  //   const saveCanvas = () => {
  //     // 获取 Canvas 元素
  //     const canvasElement = canvas.value;
  //     if (!canvasElement) return;
  //     // 获取 2D 上下文
  //     const ctx = canvasElement.getContext('2d');
      
  //     // 调用 write 函数绘制元素（假设已经存在）
  //     write();

  //     // 将 Canvas 内容转换为 Data URL
  //     const dataURL = canvasElement.toDataURL('image/png');

  //     // 创建一个新的 a 标签
  //     const link = document.createElement('a');
  //     // 设置链接的 href 属性为 Data URL
  //     link.href = dataURL;
  //     // 设置下载的文件名
  //     link.download = 'canvas.png';
  //     // 触发点击事件，下载图片
  //     link.click();
  //   }
  // }

  const form = reactive({
    wallWidth: 8500,
    wallHeight: 4200,
    selectValue: '',//有无洞口 1有 2无
    selectOpeningType: '',//洞口类型 3门洞 4窗洞
    beamHeight: 700,
    wallPageHeight: 3500,
    wallPageWidth: 600,//墙总宽度
    doorWidth: 900,
    doorHeight: 2100,
    doorToLeft: 2100,
    //门上面和墙段覆盖的段
    coverLength: 100,
    windowWidth: 900,
    windowHeight: 2100,
    windowBottomHeight: 500,
    windowToLeft: 2000, //窗户距离左侧距离
    wallSingleWidth:600  //固定的每块墙的宽度
  })

  //当前的位置距离左边的距离
  let left = 0

  let allReduce = ref(10)

  watch(()=> form.wallWidth,(newWidth:number) =>{ 
    canvas.value?.clear()
    left = 0
    canvas.value?.setWidth(newWidth/allReduce.value)
 
    console.log("watch",canvas.value?.getHeight())
  })
  watch(()=>[form.wallHeight,form.beamHeight],(newValue)=>{
    const [wallHeight,beamHeight] = newValue
    if(wallHeight - beamHeight){
      canvas.value?.setHeight((wallHeight - beamHeight)/allReduce.value)
      form.wallPageHeight = wallHeight - beamHeight
    }
  })
  watchEffect(()=>{
        
  })
  //重置表单
  const resetForm = (formEl: FormInstance | undefined) => {
    canvas.value?.clear()
    left = 0
    if (!formEl) return
    formEl.resetFields()
  }

</script>

<style scoped>
  #c{
    height: 100px;
    width: 100px;
  }
</style>
