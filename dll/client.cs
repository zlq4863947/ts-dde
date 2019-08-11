using NDde.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NodeDde
{
    public class Client
    {
        public async Task<object> GetInvoker(IDictionary<string, object> input)
        {
            var services = (IDictionary<string, object>)input["services"];
            var callbacks = (IDictionary<string, object>)input["callbacks"];

            var clients = new List<DdeClient>();
            foreach (string service in services.Keys)
            {
                var topics = (IDictionary<string, object>)services[service];
                foreach (string topic in topics.Keys)
                {
                    DdeClient client = new DdeClient(service, topic);
                    clients.Add(client);
                }
            }

            var onDisconnected = (Func<object, Task<object>>)callbacks["OnDisconnected"];
            foreach (DdeClient client in clients)
            {
                client.Disconnected += async (object sender, DdeDisconnectedEventArgs args) =>
                {
                    var obj = new Dictionary<string, object>();
                    obj["service"] = client.Service;
                    obj["topic"] = client.Topic;
                    obj["isDisposed"] = args.IsServerInitiated;
                    obj["isServerInitiated"] = args.IsServerInitiated;
                    await Task.Run(async () => await onDisconnected(obj));
                };
            }

            var onAdvise = (Func<object, Task<object>>)callbacks["OnAdvise"];
            foreach (DdeClient client in clients)
            {
                client.Advise += async (object sender, DdeAdviseEventArgs args) =>
                {
                    var obj = new Dictionary<string, object>();
                    obj["service"] = client.Service;
                    obj["topic"] = client.Topic;
                    obj["item"] = args.Item;
                    obj["text"] = Encoding.Default.GetString(args.Data).Trim('\0', ' ').ToString();
                    await Task.Run(async () => await onAdvise(obj));
                };
            }

            return (Func<object, Task<object>>)(async (i) =>
            {
                var opts = (IDictionary<string, object>)i;
                var method = (string)opts["method"];
                var command = opts.ContainsKey("command") ? (string)opts["command"] : null;
                var data =  opts.ContainsKey("data") ? (string)opts["data"] : null;
                var format = opts.ContainsKey("format") ? (int)opts["format"] : 1;
                var timeout = opts.ContainsKey("timeout") ? (int)opts["timeout"] : 10000;
                var hot = opts.ContainsKey("hot") ? (bool)opts["hot"] : true;
                var callback = opts.ContainsKey("callback")
                    ? (Func<object, Task<object>>)opts["callback"] : (o) => null;

                var results = new List<IDictionary<string, object>>();
/*
				string item = null;
				if (opts.ContainsKey("item"))
				{
					item = (string)opts["item"];
				}

                if (clients.Count == 1 && item != null) // a single client and only one 'item' is supplied.
                {
                    var client = clients.First();
					((IDictionary<string, object>)services[client.Service])[client.Topic] = new[] { item };

                    byte[] result = null;

                    switch (method)
                    {
                        case "Request":
                            result = client.Request(item, format, timeout);
                            return Encoding.Default.GetString(result);
                        case "BeginExecute":
                            await Task.Run(() =>
                            {
                                var tcs = new TaskCompletionSource<bool>();
                                AsyncCallback cb = (ar) => { tcs.SetResult(true); };
                                client.BeginExecute(command, cb, client);
                                var r = tcs.Task.Result;
                            });
                            break;
                        case "BeginPoke":
                            await Task.Run(() =>
                            {
                                var tcs = new TaskCompletionSource<bool>();
                                AsyncCallback cb = (ar) => { tcs.SetResult(true); };
                                var bytes = Encoding.Default.GetBytes((string)opts["data"] + "\0");
                                client.BeginPoke(item, bytes, format, cb, client);
                                var r = tcs.Task.Result;
                            });
                            break;
                        case "BeginRequest":
                            await Task.Run(() =>
                            {
                                var tcs = new TaskCompletionSource<byte[]>();
                                AsyncCallback cb = (ar) =>
                                {
                                    tcs.SetResult(client.EndRequest(ar));
                                };
                                client.BeginRequest(item, format, cb, client);
                                result = tcs.Task.Result;
                            });
                            return Encoding.Default.GetString(result);
                        case "BeginStartAdvise":
                            await Task.Run(() =>
                            {
                                var tcs = new TaskCompletionSource<bool>();
                                AsyncCallback cb = (ar) => { tcs.SetResult(true); };
                                client.BeginStartAdvise(item, format, hot, cb, client);
                                var r = tcs.Task.Result;
                            });
                            break;
                        case "BeginStopAdvise":
                            await Task.Run(() =>
                            {
                                var tcs = new TaskCompletionSource<bool>();
                                AsyncCallback cb = (ar) => { tcs.SetResult(true); };
                                client.BeginStopAdvise(item, cb, client);
                                var r = tcs.Task.Result;
                            });
                            break;
                        case "Service":
                            return client.Service;
                        case "Topic":
                            return client.Topic;
                        case "Handle":
                            return client.Handle;
                        case "IsConnected":
                            return client.IsConnected;
                        case "IsPaused":
                            return client.IsPaused;
                    }
                } */

                if (clients.Count != 0)
                {
                    switch (method)
                    {
                        case "Connect":
                            clients.ForEach((c) => c.Connect());
                            break;
                        case "Disconnect":
                            clients.ForEach((c) => c.Disconnect());
                            break;
                        case "Pause":
                            clients.ForEach((c) => c.Pause());
                            break;
                        case "Resume":
                            clients.ForEach((c) => c.Resume());
                            break;
                        case "Execute":
                            clients.ForEach((c) => c.Execute(command, timeout));
                            break;
                        case "Poke":
                            foreach (DdeClient client in clients)
                            {
                                var topics = (IDictionary<string, object>)services[client.Service];
                                var items = (object[])topics[client.Topic];
                                foreach (string item_ in items)
                                {
                                    client.Poke(item_, data, timeout);
                                }
                            }
                            break;
                        case "Request":
                            foreach (DdeClient client in clients)
                            {
                                var topics = (IDictionary<string, object>)services[client.Service];
                                var items = (object[])topics[client.Topic];
                                foreach (string item_ in items)
                                {
                                    var result = client.Request(item_, format, timeout);
                                    var obj = new Dictionary<string, object>();
                                    obj["service"] = client.Service;
                                    obj["topic"] = client.Topic;
                                    obj["item"] = item_;
                                    obj["result"] = Encoding.Default.GetString(result);
                                    results.Add(obj);
                                }
                            }
                            return results.ToArray();
                        case "StartAdvise":
                            foreach (DdeClient client in clients)
                            {
                                var topics = (IDictionary<string, object>)services[client.Service];
                                var items = (object[])topics[client.Topic];
                                foreach (string item_ in items)
                                {
                                    client.StartAdvise(item_, format, hot, timeout);
                                }
                            }
                            break;
                        case "StopAdvise":
                            foreach (DdeClient client in clients)
                            {
                                var topics = (IDictionary<string, object>)services[client.Service];
                                var items = (object[])topics[client.Topic];
                                foreach (string item_ in items)
                                {
                                    client.StopAdvise(item_, timeout);
                                }
                            }
                            break;
                        case "Dispose":
                            clients.ForEach((c) => c.Dispose());
                            break;
                        case "Service":
                            return clients.Select((c) => c.Service).ToArray();
                        case "Topic":
                            return clients.Select((c) => c.Topic).Distinct().ToArray();
                        case "Handle":
                            return clients.Select((c) => c.Handle).ToArray();
                        case "IsConnected":
                            return clients.All((c) => c.IsConnected);
                        case "IsPaused":
                            return clients.All((c) => c.IsPaused);
                    }
                }

                return null;
            });
        }
    }
}