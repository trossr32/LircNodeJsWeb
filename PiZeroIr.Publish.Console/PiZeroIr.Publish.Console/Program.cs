using System.IO;
using System.Text;
using CommandLine;
using Microsoft.Extensions.Configuration;
using NLog;
using NLog.Web;
using Renci.SshNet;

namespace PiZeroIr.Publish.Console
{
    class Program
    {
        private static readonly Logger Logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();

        private static IConfiguration _config;

        private static void Main(string[] args)
        {
            // parse args
            Parser.Default.ParseArguments<Options>(args);

            // load config
            _config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .Build();

            RebuildPiWebsite();

            //System.Console.ReadLine();

            LogManager.Shutdown();
        }

        private static void RebuildPiWebsite()
        {
            // instantiate SSH client
            using (SshClient client = new SshClient(_config["pi:ip"], _config["pi:user"], _config["pi:password"]))
            {
                var cmds = new StringBuilder();

                BuildInfoEcho(cmds, "Navigating to ~/nodejs/LircNodeJsWeb...");

                cmds.Append("cd ~/nodejs/LircNodeJsWeb; ");

                BuildInfoEcho(cmds, "Stopping service...");

                cmds.Append("sudo systemctl stop lircnodejsweb.service; ");

                BuildInfoEcho(cmds, "Resetting git repo...");

                cmds.Append("git reset --hard; ");
                cmds.Append("echo ''; ");

                BuildInfoEcho(cmds, "Pulling latest...");

                cmds.Append("git pull; ");
                cmds.Append("echo ''; ");

                BuildInfoEcho(cmds, "Navigating to ~/nodejs/LircNodeJsWeb/Web...");

                cmds.Append("cd ~/nodejs/LircNodeJsWeb/Web; ");

                BuildInfoEcho(cmds, "Running npm install...");

                cmds.Append("npm i; ");
                cmds.Append("echo ''; ");

                BuildInfoEcho(cmds, "Starting service...");

                cmds.Append("sudo systemctl start lircnodejsweb.service; ");

                BuildInfoEcho(cmds, "Service running!");

                client.Connect();

                SshCommand cmd = client.CreateCommand(cmds.ToString());

                var result = cmd.BeginExecute();

                using (var reader = new StreamReader(cmd.OutputStream, Encoding.UTF8, true, 1024, true))
                {
                    while (!result.IsCompleted || !reader.EndOfStream)
                    {
                        string line = reader.ReadLine();

                        if (line != null)
                            Logger.Info(line);
                    }
                }

                cmd.EndExecute(result);
            }
        }

        private static void BuildInfoEcho(StringBuilder cmds, string msg)
        {
            cmds.Append($"echo '{new string('*', msg.Length)}'; ");
            cmds.Append($"echo '{msg}'; ");
            cmds.Append($"echo '{new string('*', msg.Length)}'; ");
            cmds.Append("echo ''; ");
        }
    }
}
