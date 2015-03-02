Python and Node.js with OpenBCI
==============

![alt tag](https://raw.github.com/theRealWardo/Python_OpenBCI/master/architecture.png)

- **open_bci_v3.py** manages the connection between the OpenBCI board and Python
- **udp_server.py** exposes the data over UDP
- **socket_server.js** a Node.js server that retransmits the data over a Web Socket
- **htdocs/index.html** a hack to display data using D3.js

Running the Server
--------------
- Run `npm install` to make sure you have the dependencies
- Plugin the OpenBCI V3 Dongle and turn on the Board
- Run python scripts from (https://github.com/OpenBCI/OpenBCI_Python):

`python user.py --p "<serial port>" --add udp_server 127.0.0.1 8888 --add print`

- Modify settings according to desired behaviour. See OpenBCI_Python [README](https://github.com/OpenBCI/OpenBCI_Python/)
- Start UDP server `--> /start`
- Run `node socket_server.js`
- Visit [http://127.0.0.1:8880](http://127.0.0.1:8880) to see your brain waves

Optionally 
- Use `python udp_client.py --json` from the scripts folder to verify data is coming through
- Use `python socket_client.py` from the scripts folder to view the Web Socket data coming back into Python (requires socketio-client)

Dependency List
--------------

Python UDP demos require:
- pyserial
- numpy

Node sample requires:
- socket.io

Python Web Socket requires:
- socketio-client
