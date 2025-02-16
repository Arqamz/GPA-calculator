{
  description = "Dev shell for Next";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ...}: let
    pkgs = nixpkgs.legacyPackages."x86_64-linux";
  in {
    devShells.x86_64-linux.default = pkgs.mkShell {
      packages = with pkgs; [
	nodejs_23
	pnpm
    ];

    shellHook = ''
        echo "NextJS dev shell for transcriptly"
        echo "Node version: $(node --version)"
        echo "Pnpm version: $(pnpm --version)"
    '';

    };
  };
}
