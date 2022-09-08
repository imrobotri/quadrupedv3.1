
/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="\uf201"
namespace custom {

    //###Image recognit ||图像识别初始化
    /**
    * IODO:Image recognition internal related pins and settings 
    * IODO:图像识别内部相关引脚和设置初始化
    */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=sensor_Image_in block="Image recogni "
    export function Image_in() {
        serial.setRxBufferSize(50)
    }


    //ToggleIdentify 开启/切换(颜色、标签)
    /**
     * IODO: Turn on the color or label recognition function for setting .
     * IODO:开启设置图形的颜色或者标签识别功能。
     */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=Toggle block="OnToggle|%Fun"
    export function Toggle(Ena: EnabledID): void {
        Function_ID = Ena 
        Uart_sent()
       // Reset()    

    }


    //Toggle1 开启/切换(小球、形状)
    /**
     * IODO:Turn on the Settings Graphic Recognition function to select balls and shapes,  as well as the corresponding recognition .
     * IODO:开启设置图形识别功能，可以选择小球和形状以及对应识别颜色。
     */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=Toggle1 block="Toggle1| %Col|%Fun"
    export function Toggle1(Col: Colorchoose, Ena: EnabledID1): void {
        Color_id = Col
        Function_ID = Ena
        Uart_sent()
        //Reset()    //复位
    }

    //Toggle2 开启/切换(巡线)
    /**
     * IODO:Turn on the settings graphic recognition function to identify red or black .
     * IODO:开启设置图形识别功能，进行红色线或者黑色线的识别。
     */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=Toggle2 block="Toggle2| %Col|Line"
    export function Toggle2(Col: LineColorchoose): void {
        Function_ID = 0x03
        Linecolor_id = Col
        Uart_sent()
        //Reset()    //复位
    }


    //Together 开启/切换巡线+形状同时识别
    /**
     * IODO:Turn on the graphic recognition function to identify the line and its color, and at the same time identify the shape and its color.
     * IODO:开启设置图形识别功能，进行巡线及其颜色的识别，同时有形状及其颜色的识别。
     */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=Together block="Together| %Col|Line|%Col2|Shape"
    export function Together(Col1: LineColorchoose, Col2: Colorchoose): void {
        Function_ID = 0x06
        Linecolor_id = Col1
        Color_id = Col2
        Uart_sent()
        //Reset()    //复位
    }


    //Together1 开启/切换巡线+颜色同时识别
    /**
     * IODO:Turn on the setting pattern recognition function, which can perform line inspection and color recognition at the .
     * IODO:开启设置图形识别功能，同时进行巡线以及颜色识别。
     */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=Together1 block="Together1| %Col3|Line|and Color"
    export function Together1(Col3: LineColorchoose): void {
        Function_ID = 0x07
        Linecolor_id = Col3
        Uart_sent()
        //Reset()    //复位
    }


    //Together2 开启/切换巡线+标签同时识别
    /**
     * IODO:Enable setting pattern recognition function, and perform line patrol and AprilTag label recognition at the 
     * IODO:开启设置图形识别功能，同时进行巡线以及AprilTag标签识别。
     */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=Together2 block="Together2| %Col4|Line|and Tag"
    export function Together2(Col4: LineColorchoose): void {
        Function_ID = 0x08
        Linecolor_id = Col4
        Uart_sent()
        //Reset()    //复位
    }



    //###ColorRecognitionretu||颜色返回
    /**
    * IODO:The robot recognizes the color and returns a 16-bit number. (1: red, 2: blue, 3: both red and black, 4: yellow, 5: both red and yellow, 6: both yellow and blue, 7: red, blue and yellow at the same time, 8: green, 
    * IODO:机器人识别颜色并返回16bit数字。（1：红色，2：蓝色，3：同时有红色和黑色，4：黄色，5：同时有红色和黄色，6：同时有黄色和蓝色，7：同时有红蓝黄三色，8：绿色，9：同时有红色和绿色）
    *
    */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=ColorRecogniti block="Color Recognition return va"
    export function Colorretu(): number {
        Uart_receive()
        return Color_id

    }



    //###Ball retu value||小球返回值
    /**
    * IODO:Returns the position information of the ball. Recognition status 1 indicates recognized, 0 indicates unrecognized; the X and Y axis positions of the center of the pellet in the image; the XY two-dimensional width and height of the pellet; and the recognition effect (the higher the recognition effect, the closer the sphere is). Return value type: int.
    * IODO:返回小球的位置信息。识别状态1表示已识别，0表示未识别；图像中小球中心的X、Y轴位置；小球的XY二维宽高，以及识别效果（识别效果越高，小球的距离越近）。返回值类型：int。
    */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=sensor_Ball_retu block="Ball returnva| %P"
    export function Ball_retu(P: Bal_Position): number {
        Uart_receive()
        switch (P) {
            case Bal_Position.Status: return Bal_status
            case Bal_Position.X_axis: return Bal_X
            case Bal_Position.Y_axis: return Bal_Y
            case Bal_Position.Width: return Bal_W
            case Bal_Position.Depth: return Bal_H
            case Bal_Position.Re_effect: return Bal_pixels
            default: return 255
        }

    }


    //###Line patrol retu||巡线返回
    /**
    * IODO:Robot line patrol status returns (0: not recognized to line, 1: recognized to line). Recognition effect: The pixel value of the recognition line is 0-19200, the deviation angle range (-90 ° ~ 90 °), the deviation X axis position range (- 160 ~ 160).
    * IODO:机器人巡线状态返回（0：未识别到线，1：识别到线）。识别效果：识别线像素值大小为0-19200，偏差角度范围（-90°~90°），偏差 X 轴位置 范围(- 160~160) 。
    */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=sensor_Line_retu block="Line patrol return va| %x"
    export function Line_retu(X: Lin_Position): number {
        Uart_receive()
        switch (X) {
            case Lin_Position.Status: return Lin_detect;
            case Lin_Position.Re_effect: return Lin_effect;
            case Lin_Position.De_angle: return Lin_angle;
            case Lin_Position.De_position: return Lin_position;
            default: return 255
        }
    }


    //###ShapeRecognitionretu||形状返回
    /**
    * IODO:Recognized shape returns 0~3 numbers (0: none, 1: triangle, 2: rectangle, 3: circle)
    * IODO:识别形状返回0~3数字（0：无、1：三角形、2：矩形、3：圆形）
    */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=ShapeRecogniti block="shape recognition re"
    export function Shaperetu(): number {
        Uart_receive()
        return Shape_ID
    }

    //###Tag code position retu value||标签位置返回值
    /**
    * IODO:Returns the position value of the Tag code set, flips the corresponding position of the X, Y, and Z axes, and the flip angle of the X, Y, and Z axes.
    * IODO:返回Tag码集的位置值，翻转X、Y、Z轴对应位置及X、Y、Z轴的翻转角度。
    */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=sensor_Tag_retu block="Tag code position return va| %data"
    export function Tag_retu(data: Tag_Position): number {
        Uart_receive()
        switch (data) {
            case Tag_Position.Content_V: return Identi_pattern;
            case Tag_Position.X_axis: return Identi_x;
            case Tag_Position.Y_axis: return Identi_y;
            case Tag_Position.Z_axis: return Identi_z;
            case Tag_Position.X_flip: return Identi_Flip_x;
            case Tag_Position.Y_flip: return Identi_Flip_y;
            case Tag_Position.Z_flip: return Identi_Flip_y;
            default: return 255
        }
    }


}
