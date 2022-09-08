let num = 0
let Header = 0xaa //包头DaHeader
let Tail = 0xAB //包尾DaTail
let Color_id = 0 //基础颜色位置
let Linecolor_id = 0 //线颜色位置
let Find_ID = 0 //接收功能ID
let Function_ID = 0 //发送功能ID
let Identi_RX = pins.createBuffer(33)  //接收的缓冲区 Identify_RX
let Select_Tx = pins.createBuffer(5)  //开启功能选择：包头，功能，基础颜色位置，线颜色，包尾 //

//mall ball  //bal->ball
let Bal_status = 0x00  //status
let Bal_X = 0x00, Bal_Y = 0x00 //x-axis, y-axis
let Bal_W = 0x00, Bal_H = 0x00 //Width Height
let Bal_pixels = 0x00  //Number of pixels

//Line inspection  //lin->line
let Lin_detect = 0x00 //Detect
let Lin_effect = 0x00 //The effect of the identification line
let Lin_angle = 0x00 //angle
let Lin_position = 0x00 //position

let Shape_ID = 0 //Shapes_ID

//QR code
let Identi_x = 0x00, Identi_y = 0x00, Identi_z = 0x00
let Identi_Flip_x = 0x00, Identi_Flip_y = 0x00, Identi_Flip_z = 0x00
let Identi_status = 0x00, Identi_pattern = 0x00


//功能和颜色选择发送
function Uart_sent() { //IRecognitionSetting
    num = 0
    Select_Tx[0] = Header
    Select_Tx[1] = Function_ID //功能
    Select_Tx[2] = Color_id //基础颜色
    Select_Tx[3] = Linecolor_id //线颜色
    Select_Tx[4] = Tail
    serial.writeBuffer(Select_Tx)
    basic.pause(100)
}


// // 功能切换     数组清空赋0
// function Reset() { //IRecognitionToggle
//     num = 0
//     Select_Tx[0] = Header
//     Select_Tx[1] = 0x00
//     Select_Tx[2] = 0x00
//     Select_Tx[3] = 0x00
//     Select_Tx[4] = Tail
//     serial.writeBuffer(Select_Tx)
//     //basic.pause(100)
// }

//串口接收
function Uart_receive() {
    Identi_RX = serial.readBuffer(0)//若要避免等待数据，请将长度设置为立即返回缓冲数据:0
    if (Identi_RX[0] == Header && Identi_RX[32] == Tail) {
        Color_id = Identi_RX[1]

        Bal_status = Identi_RX[2]
        Bal_X = Identi_RX[3]
        Bal_Y = Identi_RX[4]
        Bal_W = Identi_RX[5]
        Bal_H = Identi_RX[6]
        Bal_pixels = Identi_RX[7] * 256 + Identi_RX[8]

        Lin_detect = Identi_RX[9]
        Lin_effect = Identi_RX[10]
        if (Identi_RX[11] == 0xff){
            Lin_angle = -(Identi_RX[11] + 1 - Identi_RX[12])
        } else { Lin_angle = Identi_RX[12]}

        if (Identi_RX[11] == 0xff) {
            Lin_position = -(Identi_RX[13] + 1 - Identi_RX[14])
        } else { Lin_position = Identi_RX[14] }

        Shape_ID = Identi_RX[15]

        Identi_status = Identi_RX[16]
        Identi_pattern = Identi_RX[17]
        if (Identi_RX[18] == 0xff) {
            Identi_x = -((Identi_RX[18] - Identi_RX[19] + 1)*256 + Identi_RX[20])
        } else { Identi_x = Identi_RX[19] * 256 + Identi_RX[20]}
        Identi_y = Identi_RX[21] * 256 + Identi_RX[22]

        if (Identi_RX[23] == 0xff) {
            Identi_z = -((Identi_RX[23] - Identi_RX[24] + 1) * 256 + Identi_RX[25])
        } else { Identi_z = Identi_RX[24] * 256 + Identi_RX[25] }

        Identi_Flip_x = Identi_RX[26] * 256 - Identi_RX[27]
        Identi_Flip_y = Identi_RX[28] * 256 - Identi_RX[29]
        Identi_Flip_z = Identi_RX[30] * 256 - Identi_RX[31]

    }
}

