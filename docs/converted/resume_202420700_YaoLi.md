Building Computing Clusters of Web Browsers

Yao Li (202420700)

Advisor: Yasushi Shinjo

1

Introduction

2 Proposed Method

In laboratories and offices, we see many unused PCs
and idle PCs. Mobile devices such as smartphones
and tablets also often have computing power com-
parable to old PCs.

It is widely practiced to connect PCs over a LAN
to form small HPC clusters. Conventional clus-
ter management software such as Apache Mesos
and OpenHPC requires a dedicated OS installation,
making the setup process complex. However, set-
ting up and maintaining such clusters can be chal-
lenging due to the need for specialized hardware,
software, and network configurations. While dual-
booting allows regular PCs to serve as cluster nodes,
this prevents their use for normal tasks like web
browsing.

Volunteer computing projects like SETI@home
and Folding@home have shown the potential of uti-
lizing idle computational resources. However, these
systems typically require specific software instal-
lation and face cross-platform compatibility chal-
lenges. Participants must download and install
client software, which can be a barrier to entry for
many users.

We propose a web browser-based approach to
building computing clusters with the following
goals:

• Developing a scalable architecture for dynamic
resource pooling without complex infrastruc-
ture, targeting both small HPC clusters and
volunteer computing environments

The system architecture of our browser-based com-
puting cluster is as shown in Figure 1. The system
consists of three main components:

• Management Web Server: A central server
that coordinates the cluster operations,
in-
cluding task distribution, resource monitoring,
and node management.
It is responsible for
maintaining the overall health of the cluster,
ensuring that tasks are efficiently distributed
based on the current load and availability of re-
sources. The server also handles fault tolerance
by redistributing the tasks that were running
on failed nodes to active ones.

• Web Browser Nodes Running on PCs:
Standard computers connected to the network,
each running a web browser. These nodes can
be any device with a web browser, including
desktops,
laptops, and even mobile devices.
Each node contributes its idle computational
resources to the cluster, allowing for a highly
flexible and scalable system. Nodes can join
and leave the cluster dynamically, providing a
robust and adaptable computing environment.

• Browser Applications: Each browser runs
an application in an isolated runtime environ-
ment for executing tasks. This application is
designed to be lightweight and secure, leverag-
ing the sandboxing capabilities of modern web
browsers to ensure that tasks are executed in
isolation from the host system.

• Ensuring zero-installation deployment through

This system faces several challenges that need to

standard web browsers

be addressed:

• Enabling efficient utilization of idle computa-

tional resources across the network

• Heterogeneity of browser performance.

• Unstable network connections.

• Providing secure execution through browser-

• Efficient and safe code execution in an isolated

based isolation

environment.

1

Figure 1: Cluster of Web Browsers.

• User-friendly interface for interactive use.

Our system architecture is built on the following

key technologies to address to these challenges:

• WebAssembly: Provides high-performance
task execution while maintaining platform
compatibility. WebAssembly allows code to
run at near-native speed in the browser, mak-
ing it ideal for computationally intensive tasks.
It also ensures that the same code can run on
any device with a web browser, regardless of
the underlying hardware or operating system.
We run WebAssembly tasks in the WebAssem-
bly Sandbox.

• Web Real-Time Communication[4]: En-
ables direct peer-to-peer communication be-
tween nodes for efficient data transfer. We-
bRTC supports low-latency, high-bandwidth
communication among web browsers, which
is essential for the performance of distributed
computing tasks.
It also includes built-in
mechanisms for NAT traversal, allowing nodes
behind different types of network configura-
tions to communicate directly.

• Using V86-Based Virtual Machine1: Pro-
vides x86 emulation capabilities directly in the
browser. This enables task execution in a man-
ner similar to conventional cluster management
software. The V86-based virtual machine al-
lows us to run legacy applications and software
that require a full x86 environment, providing a
flexible and powerful execution platform within
the browser.

We designe the system to be scalable, allowing for
seamless joining and leaving of nodes to the cluster
across different platforms and environments.

3 Implementation

Our implementation consists of three main compo-
nents as shown in Figure 2: the management web

1http://copy.sh/v86/

Figure 2: System Components.

server, the browser-based virtual machine, and the
communication module.

3.1 Management Web Server

The management web server implements two core
modules:

• Task Scheduler: Handles task distribution
and load balancing across nodes. It fragments
computational tasks based on node capabili-
ties and manages task allocation. The sched-
uler ensures that tasks are distributed in a way
that maximizes the utilization of available re-
sources while minimizing the overall execution
time. It also takes into account the heterogene-
ity of the nodes, assigning tasks based on their
specific capabilities and current load.

• Resource Monitor: Maintains performance
profiles and monitors node status continuously.
It tracks CPU usage, memory availability, and
network conditions to optimize resource uti-
lization. The resource monitor collects detailed
metrics from each node and uses this informa-
tion to adjust task assignments dynamically.
This helps in identifying and mitigating poten-
tial bottlenecks, ensuring that the cluster oper-
ates efficiently even under varying workloads.

The management web server is designed to be
lightweight and efficient, capable of handling a large
number of nodes with minimal overhead.
It uses
modern web technologies to ensure compatibility
and performance, and it includes mechanisms for
fault tolerance and recovery to maintain the stabil-
ity of the cluster.

2

3.2 Network Communication

The system implements two communication chan-
nels with distinct responsibilities:

• RPC (Remote Procedure Call): Handles
control communication between the manage-
ment server and nodes, including:

– Task distribution and status updates

– Resource monitoring and node manage-

ment

– Node registration and heartbeat signals

• WebRTC P2P: Enables direct peer-to-peer

communication between nodes through:

– Data channels for efficient resource shar-

ing

– Direct node-to-node task coordination

This dual-channel approach optimizes communi-

cation efficiency by:

• Using RPC for reliable server-controlled oper-
ations, ensuring that critical control messages
are delivered accurately and in a timely man-
ner.

• Leveraging WebRTC for direct peer communi-
cation to reduce server load, enabling efficient
data transfer and task coordination between
nodes without overloading the central server.

• Maintaining centralized control while enabling
decentralized data exchange, providing a bal-
ance between control and performance.

3.3 Applications

In our browser-based clusters, we plan to run the
following applications using self-scheduling.

• The server has a task bag.

• Each worker running in a browser retrieves a

task from the task bag in the server.

• The worker executes the task and returns the

result to the server.

This type of applications are common in volun-
teer computing. The advantage of this method is
that tasks are automatically assigned according to
the node’s computing power. A faster node finishes
a task soon and can start on the next task.

We are also considering interactive applications
by taking advantage of the fact that they run run in

a browser. For example, an ray tracing application
can output results to the canvas of a web browser.
Unlike traditional volunteer computing, such inter-
active applications allow the user to see the results
displayed in the browser and change the parame-
ters. For example, in the ray tracing application,
the user can change the position of a camera.

3.4 Current Progress

Our initial
functionalities including:

implementation has established core

• Basic virtual machine operations through V86

• WebRTC peer discovery and connection estab-

lishment

• Task distribution through the management

server

• Resource monitoring and basic load balancing

Ongoing work focuses on enhancing system stabil-
ity, optimizing task scheduling efficiency for the
management application, and implementing flexible
resource management APIs. We are also exploring
ways to further optimize the performance of We-
bAssembly execution and improve the scalability of
the system. Future developments will include ro-
bust fault tolerance mechanisms, enhanced security
features, and expanded support for diverse applica-
tions and use cases.

4 Related Work

BOINC established a framework for volunteer com-
puting projects [1]. Despite its robust infrastruc-
ture, BOINC requires client software installation.
Our browser-based solution removes this barrier by
running directly in web browsers, making it more
accessible to a wider audience.

Golem provides a decentralized computing power
marketplace for renting computational resources [2].
While effective for dedicated computing tasks, our
approach simplifies participation by eliminating the
need for specialized software installation. Addi-
tionally, our system leverages the ubiquity of web
browsers to create a more inclusive and flexible
computing environment.

Apache Mesos [3] demonstrates effective re-
source management. Building upon these con-
cepts, our system combines WebAssembly’s ef-
ficiency with browser accessibility to create a
lightweight, platform-independent computing envi-
ronment. Unlike Mesos, which requires a dedicated

3

w3.org/TR/2024/REC-webrtc-20241008/,
2024. Accessed: 2024-12-18.

OS installation and complex setup, our solution op-
erates entirely within the web browser, providing
a more user-friendly and easily deployable alterna-
tive.

5 Conclusion

that provide

In this paper, we proposed building web browser-
zero-
based computing clusters
installation deployment
through standard web
browsers, cross-platform compatibility, and secure
execution through WebAssembly sandboxing. This
approach leverages the ubiquity and cross-platform
nature of web browsers, allowing any device with a
browser to participate in the cluster, significantly
lowering the barrier to entry and simplifying the
setup process compared to traditional methods.

Our initial implementation has established core
functionalities including WebRTC peer discovery
and basic virtual machine operations. We have
demonstrated that it is possible to create a dis-
tributed computing environment that operates en-
tirely within the web browser, eliminating the need
for specialized software installations and making it
accessible to a broader audience.

While challenges remain in areas such as browser
performance heterogeneity and connection stability,
this approach demonstrates the feasibility of lever-
aging web browsers for distributed computing appli-
cations. Future work will focus on optimizing per-
formance, enhancing fault tolerance, and expanding
the range of supported applications.

References

[1] David P Anderson.

Boinc: A system for
public-resource computing and storage.
In
Fifth IEEE/ACM international workshop on
grid computing, pages 4–10, 2004.

[2] Golem Network. Official website. https://www.

golem.network/. Accessed: 2024-12-18.

[3] Benjamin Hindman, Andy Konwinski, Matei
Zaharia, Ali Ghodsi, Anthony D. Joseph, Randy
Katz, Scott Shenker, and Ion Stoica. Mesos: A
platform for Fine-Grained resource sharing in
the data center. In 8th USENIX Symposium on
Networked Systems Design and Implementation
(NSDI 11), pages 1–14, March 2011.

[4] Cullen Jennings, Florent Castelli, Henrik
Bostr¨om, and Jan-Ivar Bruaroey. Webrtc: Real-
time communication in browsers. https://www.

4


