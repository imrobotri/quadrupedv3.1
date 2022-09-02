
/**
 * Quadruped
 */
//% weight= 0 color=#0abcff icon="\uf201" block="Quadruped"
//% groups='["Set up","control","Additional steering gear control","Joint angle control"]'
namespace Quadruped {
/* ***********************************************基本控制***************************************** */
    /**
     *TODO: Defines the initialization of the communication pins of the microbit and the adapter board, and requires initialization before invoking basic control, external servo control, and joint control. Microbit's LED dot matrix screen will not be available after initialization.
     *TODO:定义microbit和转接板的通讯引脚的初始化，且在调用基本控制、外接舵机控制和关节控制前都需进行初始化。初始化后microbit的LED点阵屏将无法使用。
     */
    //% group="Set up"
    //% blockGap=8
    //% blockId=Quadruped_init block="init"
    export function init(): void {
        SPI_Init()
    }
    //###return hexadecimal number||返回状态信息
    /**
    * TODO:Returns the state information of the bot itself. (0x00 - idle, 0x01 - standing, 0x02 - self-balancing, 0x04 - trotting, 0x05 - fast diagonal gait, 0x06 - crawling, 0x07 - recovering, 0x08 - falling, 0x13 - slow diagonal gait)
    * TODO:返回机器人自身的状态信息。（0x00--空闲，0x01--站立中，0x02--自平衡中，0x04--小跑，0x05--快速对角步态，0x06--爬行，0x07--恢复中，0x08--摔倒，0x13--慢速对角步态）
    */
    //% group="control"
    //% blockGap=8
    //% blockId=Quadruped_Status block="Status"
    export function Status(): number {
        return robot_mode;
    }
    //###Returns action status information||返回动作组状态信息
    /**
    * TODO:Returns the status information for the robot action group. (0x00 -- Idle, 0x01 -- In Progress, 0x02 -- End)
    * TODO:返回机器人动作组的状态信息。（0x00--空闲,0x01--进行中,0x02--结束）
    */
    //% group="control"
    //% blockGap=8
    //% blockId=Quadruped_Action_Status block="Action_Status"
    export function Action_Status(): number {
        return M_Action_group_status;
    }

    //####Reset||复位
    /**
     *TODO:The robot's movement speed and attitude angle are reset to 0.
     *TODO:机器人的移动速度和姿态角都会重置为0。
     */
    //% group="control"
    //% blockGap=8
    //% blockId=Quadruped_Reset block="Reset"
    export function Reset(): void {
        rc_spd_cmd_X = 0.00 //x_speed
        rc_spd_cmd_y = 0.00 //y_speed
        rc_att_rate_cmd = 0.00 // Turn to speed
        rc_spd_cmd_z = 0.00 //Altitude speed
        //rc_pos_cmd = 0.00 //height
        rc_att_cmd_x = 0.00 //Pitch
        rc_att_cmd_y = 0.00 //Side swing
        rc_att_cmd = 0.00 //Heading
    }
    //####Height||高度
    /**
     * TODO: Robot body height adjustment. (Range 0~10,0 Lowest, 10 High)
     * TODO: 机器人本体高度调节。（范围0~10，0最低，10最高）
     */
    //% group="control"
    //% blockGap=8
    //% h.min=0.00 h.max=10.00
    //% blockId=Quadruped_Height block="Height %h"
    export function Height(h: number): void {
        rc_pos_cmd = h * 0.1
        for (let i = 0; i < 10; i++) {
            SPI_Send()
            basic.pause(100)
        }

    }
    //###Start||启动
    /**
     * TODO:The robot powers up and enters a semi-squat state. (Internal start sending instructions, basic control needs to be initialized before other blocks can be used)
     * TODO:机器人上电进入半蹲状态（内部开始发送指令，基本控制需要先初始化启动才能使用其他积木）
     */
    //% group="control"
    //% blockGap=8
    //% blockId=Quadruped_Start block="Start"
    export function Start(): void {
        gait_mode = 4
        state = 1
        basic.pause(3000)
        //serial.writeNumber(3)
        while (1) {
            SPI_Send()
            if (robot_mode == 1) {
                for (let i = 0; i < 5; i++) {
                    SPI_Send()
                    basic.pause(100)
                }
                return
            }
            //serial.writeNumber(4)
        }
    }
    //###Quadruped Stand||站立
    /**
     * TODO:The robot enters standing mode. (You need to stop when trotting and crawling, you can add this block to enter standing mode)
     * TODO:机器人进入站立模式。（小跑和爬行时需要原地停止，可以加这个积木进入站立模式）
     */
    //% group="control"
    //% blockGap=8
    //% blockId=Quadruped_Stand block="Stand"
    export function Stand(): void {
        Standing()
    }
    //####Quadruped Fall recovery||摔倒恢复
    /**
     * TODO:Automatically detect whether the robot has entered the fall mode, and if so, automatically perform the fall recovery action.
     * TODO:自动检测机器人是否进入跌倒模式，若是则自动进行跌倒恢复动作。
     */
    //% group="control"
    //% blockGap=8
    //% blockId=Quadruped_Fall_recovery block="Fall recovery"
    export function Fall_re(): void {
        if (robot_mode != 0x08)
            return
        if (robot_mode == 0x08) {
            gait_mode = 0x07
            SPI_Send()
            robot_mode_1 = robot_mode
            while (robot_mode_1 != 0x07) {
                return
            }
        }
    }
    //###Heartbeat||心跳
    /**
     * TODO:This block needs to be placed in a loop to ensure that the robot's instructions are received normally and to prevent communication loss.
     * TODO:此方块需要放在循环当中，保证机器人的指令正常接收，防止通讯丢失。
     */
    //% group="control"
    //% blockGap=8
    //% blockId=Quadruped_Heartbeat block="Heartbeat"
    export function Heartbeat(): void {
        SPI_Send()
        //serial.writeNumber(10)
    }
    //###Stop||停止
    /**
     * TODO:The robot enters shutdown mode, the fuselage crouches, and the internal stops sending commands.
     * TODO:机器人进入关机模式，机身下蹲，内部停止发送指令。
     */
    //% group="control"
    //% blockGap=8
    //% blockId=Quadruped_Stop block="Stop"
    export function Stop(): void {
        if (robot_mode == 0x04 || robot_mode == 0x06) {
            Standing()
        }
        if (robot_mode == 1 || robot_mode == 0X02) {
            rc_pos_cmd = 0.01
        }
        SPI_Send()
        basic.pause(50)
        SPI_Send()
        state = 0
    }
    //###gait||步态
    /**
     * TODO:The robot has four gait options: trotting, crawling, slow diagonal and fast diagonal. (Note: Crawling gait can only be used when the fuselage is at its highest state)
     * TODO:机器人四种步态选择：小跑、爬行、慢速对角、快速对角。（注意：爬行步态只能在机身处于最高状态时使用）
     */
    //% group="control"
    //% blockGap=8
    //% blockId=Quadruped_Gait block="Gait | %g"
    export function Gait(g: gait): void {
        switch (g) {
            case gait.Trot:
                gait_mode = 0x01;
                while (1) {
                    SPI_Send()
                    if (robot_mode == 0x04) {
                        SPI_Send()
                        //serial.writeNumber(2)
                        return
                    }
                }
            case gait.Crawl:
                rc_pos_cmd = 1
                for (let i = 0; i < 5; i++) {
                    SPI_Send()
                    basic.pause(100)
                }
                gait_mode = 0x03;
                while (1) {
                    SPI_Send()
                    if (robot_mode == 0x06) {
                        SPI_Send()
                        //serial.writeNumber(2)
                        return
                    }
                }
            case gait.S_TROT:
                rc_pos_cmd = 1
                for (let i = 0; i < 5; i++) {
                    SPI_Send()
                    basic.pause(100)
                }
                gait_mode = 0x0D;
                while (1) {
                    SPI_Send()
                    if (robot_mode == 0x0D) {
                        SPI_Send()
                        return
                    }
                }
            case gait.F_TROT:
                rc_pos_cmd = 1
                for (let i = 0; i < 5; i++) {
                    SPI_Send()
                    basic.pause(100)
                }
                gait_mode = 0x01;
                while (1) {
                    SPI_Send()
                    if (robot_mode == 0x04) {
                        SPI_Send()
                        //serial.writeNumber(2)
                        break
                    }
                }
                gait_mode = 0x02;
                while (1) {
                    SPI_Send()
                    if (robot_mode == 0x05) {
                        SPI_Send()
                        return
                    }
                }
        }
        SPI_Send()
    }


    //###Action group||动作组
    /**
    * TODO:Robot action group selection and whether to enable the call, currently stored two action groups.
    * TODO:机器人动作组选择及是否使能调用，目前存储了两个动作组。
    */
    //% group="control"
    //% blockGap=8
    //% Group.min=0 Group.max=10
    //% time1.min=0 time1.max=255
    //% blockId=Quadruped_Action_groups block="Action group|%Group|state %sta"
    export function Action_groups(Group: number, sta: Actions): void {
        Action_group = Group
        if (sta == Actions.Enable) {
            Action_group_status = 1
        }
        else {
            Action_group_status = 0
        }
        SPI_Send()


    }
    //###Movement direction and speed||运动方向与速度
    /**
    * TODO:The robot moves forward and backward, left and right, and rotates left and right, and the corresponding speed control. Time is measured in seconds.
    * TODO:机器人前后、左右移动和左右旋转的动作选择，及对应的速度控制。时间以秒为单位。
    */
    //% group="control"
    //% blockGap=8
    //% speed1.min=0.00 speed1.max=10.00
    //% time1.min=0 time1.max=255
    //% blockId=Quadruped_Control_s block="Control direction| %m|speed %speed1|time %time1"
    export function Control_s(m: Mov_dir, speed1: number, time1: number): void {
        let Sum_S = 0.00
        let time_ms = 0
        let time_s = time1 * 1000
        let time_start = 0
        Sum_S = speed1 / 100.00
        SPI_Send()
        switch (m) {
            case Mov_dir.For:
                rc_spd_cmd_X = Sum_S; SPI_Send(); break;
            case Mov_dir.Bac:
                rc_spd_cmd_X = (-Sum_S); SPI_Send(); break;
            case Mov_dir.Turn_l:
                rc_att_rate_cmd = (speed1 * 5); SPI_Send(); break;
            case Mov_dir.Turn_r:
                rc_att_rate_cmd = (-speed1 * 5); SPI_Send(); break;
            case Mov_dir.Shift_l:
                rc_spd_cmd_y = (-Sum_S); SPI_Send(); break;
            case Mov_dir.Shift_r:
                rc_spd_cmd_y = Sum_S; SPI_Send(); break;
        }
        //for (let e = 0; e < time1; e++) {
        //    SPI_Send()
        //    basic.pause(1000)
        //}
        time_start = input.runningTime()
        while (1) {
            time_ms = input.runningTime() - time_start
            SPI_Send()
            if (time_s <= time_ms)
                return
        }
    }
    //###Control angle||控制角度
    /**
    * TODO:The robot swings left and right, heads up, bows down and twists left and right, and the corresponding angle control. Time is measured in seconds.
    * TODO:机器人左右摆动、抬头、低头和左右扭转的动作选择，及对应的角度控制。时间以秒为单位。
    */
    //% group="control"
    //% blockGap=8
    //% angle1.min=0.00 angle1.max=10.00
    //% time1.min=0 time1.max=255
    //% blockId=Quadruped_Control_a block="Control angle |%m|angle_size %angle1|time %time1"
    export function Control_a(m: Mov_ang, angle1: number, time1: number): void {
        let time_ms = 0
        let time_s = time1 * 1000
        let time_start = 0
        switch (m) {
            case Mov_ang.Look_d:
                rc_att_cmd_x = angle1; break;
            case Mov_ang.Look_u:
                rc_att_cmd_x = (-angle1); break;
            case Mov_ang.L_swing:
                if (angle1 == 0) {
                    rc_att_cmd_y = 0; break;
                }
                else {
                    rc_att_cmd_y = angle1 + 10; break;
                }
            case Mov_ang.R_swing:
                if (angle1 == 0) {
                    rc_att_cmd_y = 0; break;
                }
                else {
                    rc_att_cmd_y = (-angle1) - 10; break;
                }
            case Mov_ang.Yaw_l:
                rc_att_cmd = angle1; break;
            case Mov_ang.Yaw_r:
                rc_att_cmd = -(angle1); break;
        }
        //for (let e = 0; e < time1; e++) {
        //    SPI_Send()
        //    basic.pause(1000)
        //}
        time_start = input.runningTime()
        while (1) {
            time_ms = input.runningTime() - time_start
            SPI_Send()
            if (time_s <= time_ms)
                return
        }

    }

    //###Joint angle control||关节控制
    /**
    * TODO:The robot can choose the corresponding leg, joint angle, and whether to execute the command of the current block.
    * TODO:机器人可以选择对应的腿、关节角度以及是否执行当前积木的命令。
    */
    //% group="Joint angle control"
    //% blockGap=9
    //% blockId=Quadruped_Joint block="Joint angle control | %j|thigh %d|Calf %x|Side led %c| %site "
    export function Joint(j: Joints, d: number, x: number, c: number, site: sIte): void {
        switch (j) {
            case Joints.Left_fr: FL_d = d; FL_x = x; FL_c = c; break;
            case Joints.Left_hi: HL_d = d; HL_x = x; HL_c = c; break
            case Joints.Right_fr: FR_d = d; FR_x = x; FR_c = c; break
            case Joints.Right_hi: HR_d = d; HR_x = x; HR_c = c; break
        }
        if (site = 1)
            Joint_SPI_Send()
    }

    //###Joint Heartbeat||关节心跳
    /**
    * TODO:Constantly send the command information set up in the previous step to the robot to prevent the loss of machine communication.
    * TODO:不断发送上一步设置的命令信息给机器人，防止机器通讯丢失。
    */
    //% group="Joint angle control"
    //% blockGap=8
    //% blockId=Joint_Heartbeat block="Joint Heartbeat"
    export function Joint_Heartbeat(): void {
        Joint_SPI_Send()
    }

/* ***********************************************传感器***************************************** */

    //###Ultrasound||超声波
    /**
    * TODO:Select the transmit and receive pins corresponding to the robot ultrasonic module and select the units in which the data is returned.
    * TODO:选择机器人超声波模块对应的发射和接收引脚，并选择返回数据的单位。
    */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=sensor_Model block="Ultrasound |tr %trig |re %echo | unit %unit"
    export function Ultrasound(trig: DigitalPin, echo: DigitalPin, unit: Unit, maxCmDistance = 500): number {
        // send pulse
        maxCmDistance = 500
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);
        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);
        switch (unit) {
            case Unit.Centimeters: return Math.idiv(d, 58);
            case Unit.Inches: return Math.idiv(d, 148);
            default: return d;
        }
    }
    //###Infrared||红外
    /**
     * TODO:The robot selects the data receiving pin of the infrared sensor, and the status return value 0 indicates that there is an obstacle and 1 indicates that the obstacle is not recognized.
     * TODO:机器人选择红外传感器的数据接收引脚，状态返回值0代表有障碍物，1代表未识别到障碍物。
     */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=sensor_Infrared block="Infrared |mode %value |pin %pin"
    export function Infrared(pin: DigitalPin): number {
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin);
    }
    //###Human body induction||人体感应
    /**
    * TODO:The robot selects the data receiving pin of the human sensor, and the status return value 0 represents that the human body is not recognized, and 1 represents the recognition of the human body.
    * TODO:机器人选择人体感应器的数据接收引脚，状态返回值0代表未识别到人体，1代表识别到人体。
    */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=sensor_Human_Infrared block="Human Infrared|pin|%pin"
    export function Human_induction(pin: AnalogPin, value = 50): number {
        let w = pins.analogReadPin(pin)
        if (w >= value)
            return 1
        return 0
    }
    //###GestureInit||手势初始化
    /**
    * IODO:Gesture related pins and configuration settings (success: 0 fail: 255)
    * IODO:手势相关引脚、配置设置（成功：0 失败：255）
    */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=sensor_GestureInit block="GestureInit"
    export function GestureInit(): number {
        basic.pause(800);//等待芯片稳定
        if (GestureReadReg(0) != 0x20) {
            return 0xff;
        }
        for (let i = 0; i < Init_Register_Array.length; i++) {
            GestureWriteReg(Init_Register_Array[i][0], Init_Register_Array[i][1]);
        }
        GestureSelectBank(0);
        for (let i = 0; i < Init_Gesture_Array.length; i++) {
            GestureWriteReg(Init_Gesture_Array[i][0], Init_Gesture_Array[i][1]);
        }
        return 0;
    }
    //###GetGesture||获取手势
    /**
    * IODO:Returns the value of the gesture direction
    * IODO:返回手势方向的值
    */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=sensor_GetGesture block="GetGesture"
    export function GetGesture(): number {

        let date = GestureReadReg(0x43);

        switch (date) {
            case GES_RIGHT_FLAG:
            case GES_LEFT_FLAG:
            case GES_UP_FLAG:
            case GES_DOWN_FLAG:
            case GES_FORWARD_FLAG:
            case GES_BACKWARD_FLAG:
            case GES_CLOCKWISE_FLAG:
            case GES_COUNT_CLOCKWISE_FLAG:
                break;
            default:
                date = GestureReadReg(0x44);
                if (date == GES_WAVE_FLAG) {
                    return 256;
                }
                break;
        }
        return date;
    }

    //###Select_gesture_as||选择手势为
    /**
    * IODO:Defines the direction of the gesture and sets it to a value.
    * IODO:定义手势的方向并设置为一个值。
    */
    //% subcategory=sensor
    //% blockGap=8
    //% blockId=sensor_Select_gesture_as block="Select_gesture_as | %state"
    export function Select_gesture_as(state: gesture): number {
        return state;
    }

    //###Steering gear control||舵机控制
    /**
    * IODO:The robot selects an external control pin, where the PWM value range: 500-2500 (representing the angle 0 ° ~ 180 °), the servo response speed range: 1 ~ 10. (1 is the fastest, 10 is the slowest)
    * IODO:机器人选择外部控制引脚，其中PWM值范围：500-2500（代表角度0°~180°），舵机响应速度范围：1~10。（1为最快，10为最慢）
    */
    //% group="Additional steering gear control"
    //% blockGap=8
    //% h.min=0 h.max=3
    //% pwm.min=500 pwm.max=2500
    //% Gap.min=1 Gap.max=9
    //% blockId=sensor_Steering_gear block="Steering_gear| %h | PWM_value %pwm|Rotation speed %Gap"
    export function Steering_gear(h: number, pwm: number, Gap: number) {
        usb_send_cnt_1 = 0;

        ToSlaveBuf_1[usb_send_cnt_1++] = DaHeader_1; //head
        ToSlaveBuf_1[usb_send_cnt_1++] = SSLen - 2; //Fixed length
        ToSlaveBuf_1[usb_send_cnt_1++] = 2;  //function code

        ToSlaveBuf_1[usb_send_cnt_1++] = h;
        ToSlaveBuf_1[usb_send_cnt_1++] = pwm >> 8;
        ToSlaveBuf_1[usb_send_cnt_1++] = (pwm << 8) >> 8;
        ToSlaveBuf_1[usb_send_cnt_1++] = Gap;

        ToSlaveBuf_1[SSLen - 1] = DaTail_1;//Fixed length

        SG_SPI_Send()
    }
/* ***********************************************图像识别***************************************** */
}
