using System;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

namespace BShow {
	class Program {
		static byte[] read_bitmap(Bitmap bmp)
		{
			Rectangle rect = new Rectangle(0, 0, bmp.Width, bmp.Height);
			BitmapData bitmapdata = bmp.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
			int length = bitmapdata.Stride * bitmapdata.Height;
			byte[] destination = new byte[length];
			Marshal.Copy(bitmapdata.Scan0, destination, 0, length);
			bmp.UnlockBits(bitmapdata);
			return destination;
		}

		static byte enc_byte(byte n, int ll, int vv)
		{
			return (vv != 0) ? ((byte)((1 << (((byte)ll) & 0x1f)) | n)) : ((byte)(n & ~((byte)(1 << (((byte)ll) & 0x1f)))));
		}

		static int dec_byte(byte n, int ll)
		{
			for (int vv = 0; vv < 2; ++vv)
			{
				for (byte org = 0;; ++org)
				{
					if (enc_byte(org, ll, vv) == n) return vv;
					if (org == byte.MaxValue) break;
				}
			}
			return 0;
		}

		static byte[] dec_file(byte[] bb)
		{
			byte[] tmp = new byte[bb.Length / 8];
			int ll = 0, index = 0, done = 0;
			for (int i = 0; i < tmp.Length; ++i)
			{
				bool ok = true;
				tmp[i] = 0;
				for (int j = 7; j >= 0; --j) {
					int vv = dec_byte(bb[index++], ll);
					if (vv == -1)
					{
						ok = false;
						break;
					}
					tmp[i] |= (byte)((byte)vv << j);
					ll ^= 1;
				}
				if (!ok) break;
				++done;
			}

			byte[] dec = new byte[done];
			for (int i = 0; i < done; ++i)
			{
				dec[i] = tmp[i];
			}
			return dec;
		}

		static void Main(string[] args)
		{
			string path = "bhide-sample.bmp";
			if (!File.Exists(path))
			{
				Console.WriteLine("[+] Files doesn't exist");
			}

			Bitmap bmp = new Bitmap(path);
			byte[] bb = read_bitmap(bmp);
			byte[] dec = dec_file(bb);
			File.WriteAllBytes("bhide-sample.dec", dec);
		}
	}
}
