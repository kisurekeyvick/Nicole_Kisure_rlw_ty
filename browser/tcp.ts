/**
 * TCP协议：如何保证页面文件能被完整送达浏览器？
 */

/**
 * 在衡量 Web 页面性能的时候有一个重要的指标叫“FP（First Paint）”，是指从页面加载到首次开始绘制的时长。
 * 
 * 那什么影响 FP 指标呢？其中一个重要的因素是网络加载速度。
 */

// 一个数据包的“旅程”
/**
 * 第一步 IP：把数据包送达目的主机 
 * 
 * 数据包要在互联网上进行传输，就要符合网际协议(IP)标准。
 * 互联网上不同的在线设备都有唯一的地址，地址只是一个数字，这和大部分家庭收件地址类似，你只需要知道一个家庭的具体地址，
 *      就可以往这个地址发送包裹，这样物流系统就能把物品送到目的地。
 * 
 * 计算机的地址就称为 IP 地址，访问任何网站实际上只是你的计算机向另外一台计算机请求信息。
 * 
 * 如果要想把一个数据包从主机 A 发送给主机 B，那么在传输之前，数据包上会被附加上主机 B 的 IP 地址信息，这样在传输过程中才能正确寻址。
 * 额外地，数据包上还会附加上主机 A 本身的 IP 地址，有了这些信息主机 B 才可以回复信息给主机 A。
 * 这些附加的信息会被装进一个叫 IP 头的数据结构里。IP 头是 IP 数据包开头的信息，
 * 包含 IP 版本、源 IP 地址、目标 IP 地址、生存时间等信息。
 * 
 * 
 * 
 * 如图：【IP 网络三层传输模型.png】
 * 个数据包从主机 A 到主机 B 的旅程:
 *      - 上层将含有“极客时间”的数据包交给网络层
 *      - 网络层再将 IP 头附加到数据包上，组成新的 IP 数据包，并交给底层
 *      - 底层通过物理网络将数据包传输给主机 B
 *      - 数据包被传输到主机 B 的网络层，在这里主机 B 拆开数据包的 IP 头信息，并将拆开来的数据部分交给上层
 *      - 最终，含有“极客时间”信息的数据包就到达了主机 B 的上层了
 */
 
/**
 * 第二步 UDP：把数据包送达应用程序
 * 
 * IP 是非常底层的协议，只负责把数据包传送到对方电脑，但是对方电脑并不知道把数据包交给哪个程序，是交给浏览器还是交给王者荣耀？
 * 因此，需要基于 IP 之上开发能和应用打交道的协议，最常见的是“用户数据包协议（User Datagram Protocol）”，简称 UDP
 * 
 * UDP 中一个最重要的信息是端口号，端口号其实就是一个数字，每个想访问网络的程序都需要绑定一个端口号。
 * 通过端口号 UDP 就能把指定的数据包发送给指定的程序了，所以 IP 通过 IP 地址信息把数据包发送给指定的电脑，
 * 而 UDP 通过端口号把数据包分发给正确的程序。
 * 和 IP 头一样，端口号会被装进 UDP 头里面，UDP 头再和原始数据包合并组成新的 UDP 数据包。
 * UDP 头中除了目的端口，还有源端口号等信息。
 * 
 * 如图：【UDP 网络四层传输模型.png】
 * 数据包从主机 A 旅行到主机 B 的路线:
 *      - 上层将含有“极客时间”的数据包交给传输层
 *      - 传输层会在数据包前面附加上 UDP 头，组成新的 UDP 数据包，再将新的 UDP 数据包交给网络层
 *      - 网络层再将 IP 头附加到数据包上，组成新的 IP 数据包，并交给底层
 *      - 数据包被传输到主机 B 的网络层，在这里主机 B 拆开 IP 头信息，并将拆开来的数据部分交给传输层
 *      - 在传输层，数据包中的 UDP 头会被拆开，并根据 UDP 中所提供的端口号，把数据部分交给上层的应用程序
 *      - 最终，含有“极客时间”信息的数据包就旅行到了主机 B 上层应用程序这里
 * 
 * 
 * 在使用 UDP 发送数据时，有各种因素会导致数据包出错，虽然 UDP 可以校验数据是否正确，但是对于错误的数据包，
 * UDP 并不提供重发机制，只是丢弃当前的包，而且 UDP 在发送之后也无法知道是否能达到目的地。
 * 
 * 虽说 UDP 不能保证数据可靠性，但是传输速度却非常快，所以 UDP 会应用在一些关注速度、
 * 但不那么严格要求数据完整性的领域，如在线视频、互动游戏等。
 */

/**
 * 第三步 TCP：把数据完整地送达应用程序
 * 
 * 对于浏览器请求，或者邮件这类要求数据传输可靠性（reliability）的应用，如果使用 UDP 来传输会存在两个问题：
 * (1) 数据包在传输过程中容易丢失
 * (2) 大文件会被拆分成很多小的数据包来传输，这些小的数据包会经过不同的路由，并在不同的时间到达接收端，
 *      而 UDP 协议并不知道如何组装这些数据包，从而把这些数据包还原成完整的文件
 */


