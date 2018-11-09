using CommandLine;

namespace PiZeroIr.Publish.Console
{
    internal class Options
    {
        [Option('v', "verbose", Required = false, HelpText = "Set output to verbose messages.")]
        public bool Verbose { get; set; }
    }
}