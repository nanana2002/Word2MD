Building Computing Clusters of Web Browsers

Yao Li1, Yasushi Shinjo1

1University of Tsukuba

1

Introduction

2 Proposed Method

It is widely practiced to connect PCs over a LAN
to form small HPC clusters. Conventional clus-
ter management software such as Apache Mesos
and OpenHPC requires a dedicated OS installa-
tion, making the setup process complex. While
dual-booting allows regular PCs to serve as clus-
ter nodes, this prevents their use for normal tasks
like web browsing.

High-Performance Computing (HPC) clusters are
essential for a wide range of scientific and engineer-
ing applications, from climate modeling to molecu-
lar dynamics simulations. These clusters typically
consist of multiple interconnected computers that
work together to perform large-scale computations.
However, setting up and maintaining such clusters
can be challenging due to the need for specialized
hardware, software, and network configurations.

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

• Ensuring zero-installation deployment through

standard web browsers

• Enabling efficient utilization of idle computa-

tional resources across the network

The system architecture of our browser-based com-
puting cluster is as shown in Figure 1. The system
consists of three main components:

• Management Web Server: A central server
that coordinates the cluster operations, includ-
ing task distribution, resource monitoring, and
node management. The server communicates
with nodes through WebSockets and WebRTC.
It is responsible for maintaining the overall
health of the cluster, ensuring that tasks are ef-
ficiently distributed based on the current load
and availability of resources. The server also
handles fault tolerance by redistributing the
tasks that were running on failed nodes to ac-
tive ones.

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
our application that provides an isolated run-
time environment for executing distributed
tasks. This application is designed to be
lightweight and secure,
leveraging the sand-
boxing capabilities of modern web browsers
to ensure that tasks are executed in isolation
from the host system. The application com-
municates with the management server to re-
ceive tasks and report results, and it uses We-
bRTC for direct peer-to-peer communication
with other nodes.

• Providing secure execution through browser-

based isolation

Our system architecture is built on the following
key technologies to ensure efficiency, security, and

1

3

Implementation

Our implementation consists of three main compo-
nents as shown in Figure 2: the management web
server, the browser-based virtual machine, and the
communication module.

Figure 1: Cluster of Web Browsers.

3.1 Management Web Server

scalability:

• WebAssembly: Provides high-performance
task execution while maintaining platform
compatibility. WebAssembly allows code to
run at near-native speed in the browser, mak-
ing it ideal for computationally intensive tasks.
It also ensures that the same code can run on
any device with a web browser, regardless of
the underlying hardware or operating system.

• WebRTC Web Real-Time Communica-
tion: Enables direct peer-to-peer communi-
cation between nodes for efficient data trans-
fer. WebRTC supports low-latency, high-
bandwidth communication, which is essential
for the performance of distributed computing
tasks. It also includes built-in mechanisms for
NAT traversal, allowing nodes behind different
types of network configurations to communi-
cate directly.

• Dynamic Resource Management: Ensures
optimal distribution of computational
loads
across the cluster. The management server
continuously monitors the status of each node,
including CPU usage, memory availability, and
network conditions. Based on this information,
it dynamically allocates tasks to ensure that re-
sources are used efficiently and that no single
node is overloaded.

We designed the system to be scalable, allowing
for seamless joining and leaving of nodes to the
cluster. This architecture provides a foundation
for building efficient and accessible browser-based
computing clusters that can leverage idle computa-
tional resources across different platforms and en-
vironments. The system is designed to handle a
wide range of tasks, from simple data processing to
complex simulations.

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

3.2 Browser-based Virtual Machine

We support the following two types of execution
environments for applications:

• Using V86-Based Virtual Machine1: Pro-
vides x86 emulation capabilities directly in the
browser. This enables task execution in a man-
ner similar to conventional cluster management
software. The V86-based virtual machine al-
lows us to run legacy applications and software
that require a full x86 environment, providing a

1http://copy.sh/v86/

2

• WebRTC P2P(Web Real-Time Commu-
nication): Enables direct peer-to-peer com-
munication between nodes through:

– Data channels for efficient resource shar-

ing

– Direct node-to-node task coordination

– Low-latency data transfer between peer

nodes

– NAT traversal for direct connectivity

WebRTC supports high-bandwidth,
low-
latency communication, which is essential for
the performance of distributed computing
tasks.
It also includes built-in mechanisms
for NAT traversal, allowing nodes behind
different types of network configurations to
communicate directly.

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

3.4 Current Progress

Our initial
functionalities including:

implementation has established core

• Basic virtual machine operations through V86

• WebRTC peer discovery and connection estab-

lishment

• Task distribution through the management

Figure 2: System Components.

flexible and powerful execution platform within
the browser.

• Running a single WebAssembly binary
in the WebAssembly Sandbox: Ensures
secure and efficient execution through mem-
ory isolation and secure execution boundaries,
and cross-platform compatibility across differ-
ent operating systems. WebAssembly allows
us to achieve near-native performance for com-
putational tasks, making it ideal
for high-
The
performance computing applications.
sandboxing capabilities of WebAssembly also
provide a secure execution environment, pro-
tecting both the host system and the integrity
of the computations.

The browser-based virtual machine is designed to
be highly portable and secure, leveraging the capa-
bilities of modern web browsers to provide a robust
execution environment for distributed tasks.

3.3 Network Communication

The system implements two communication chan-
nels with distinct responsibilities:

• RPC (Remote Procedure Call): Handles
control communication between the manage-
ment server and nodes, including:

– Task distribution and status updates

server

– Resource monitoring and node manage-

ment

– Node registration and heartbeat signals

RPC provides a reliable and structured way to
manage the control flow within the cluster, en-
suring that commands and status updates are
transmitted accurately and efficiently.

• Resource monitoring and basic load balancing

Ongoing work focuses on enhancing system stabil-
ity, optimizing task scheduling efficiency for the
management application, and implementing flexible
resource management APIs. We are also exploring
ways to further optimize the performance of We-
bAssembly execution and improve the scalability of

3

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

golem.network/. Accessed: 2024-11-04.

[3] Benjamin Hindman, Andy Konwinski, Matei
Zaharia, Ali Ghodsi, Anthony D. Joseph, Randy
Katz, Scott Shenker, and Ion Stoica. Mesos: A
platform for Fine-Grained resource sharing in
the data center. In 8th USENIX Symposium on
Networked Systems Design and Implementation
(NSDI 11), pages 1–14, March 2011.

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
OS installation and complex setup, our solution op-
erates entirely within the web browser, providing
a more user-friendly and easily deployable alterna-
tive.

5 Conclusion

that provide

In this paper, we proposed building web browser-
based computing clusters
zero-
through standard web
installation deployment
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

4


