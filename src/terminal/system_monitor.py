"""
System monitoring tools for the terminal.
"""
import psutil
import os
from typing import List, Dict


class SystemMonitor:
    """System monitoring and process management."""
    
    def get_processes(self) -> str:
        """Get list of running processes."""
        try:
            processes = []
            processes.append(f"{'PID':<8} {'NAME':<20} {'CPU%':<8} {'MEM%':<8} {'STATUS'}")
            processes.append("-" * 60)
            
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'status']):
                try:
                    info = proc.info
                    cpu_pct = info['cpu_percent'] if info['cpu_percent'] is not None else 0.0
                    mem_pct = info['memory_percent'] if info['memory_percent'] is not None else 0.0
                    processes.append(
                        f"{info['pid']:<8} {info['name'][:19]:<20} "
                        f"{cpu_pct:<8.1f} {mem_pct:<8.1f} "
                        f"{info['status']}"
                    )
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            return '\n'.join(processes[:20])  # Limit to first 20 processes
        except Exception as e:
            return f"Error getting processes: {str(e)}"
    
    def get_system_info(self) -> str:
        """Get system resource information."""
        try:
            # CPU information
            cpu_percent = psutil.cpu_percent(interval=1)
            cpu_count = psutil.cpu_count()
            
            # Memory information
            memory = psutil.virtual_memory()
            
            # Disk information
            disk = psutil.disk_usage('/')
            
            # Load average (Unix-like systems)
            try:
                load_avg = os.getloadavg()
                load_str = f"Load average: {load_avg[0]:.2f}, {load_avg[1]:.2f}, {load_avg[2]:.2f}"
            except (AttributeError, OSError):
                load_str = "Load average: N/A"
            
            output = []
            output.append("System Information:")
            output.append("-" * 40)
            output.append(f"CPU Usage: {cpu_percent}% ({cpu_count} cores)")
            output.append(f"Memory: {memory.percent}% used ({self._bytes_to_human(memory.used)}/{self._bytes_to_human(memory.total)})")
            output.append(f"Disk: {disk.percent}% used ({self._bytes_to_human(disk.used)}/{self._bytes_to_human(disk.total)})")
            output.append(load_str)
            
            return '\n'.join(output)
        except Exception as e:
            return f"Error getting system info: {str(e)}"
    
    def get_disk_usage(self) -> str:
        """Get disk usage information."""
        try:
            output = []
            output.append(f"{'Filesystem':<20} {'Size':<10} {'Used':<10} {'Avail':<10} {'Use%':<6} {'Mounted on'}")
            output.append("-" * 80)
            
            # Get all disk partitions
            partitions = psutil.disk_partitions()
            
            for partition in partitions:
                try:
                    # Skip special filesystems that might cause issues
                    if partition.fstype in ('devfs', 'autofs', 'proc', 'sysfs'):
                        continue
                        
                    usage = psutil.disk_usage(partition.mountpoint)
                    
                    total = self._bytes_to_human(usage.total)
                    used = self._bytes_to_human(usage.used)
                    free = self._bytes_to_human(usage.free)
                    percent = f"{usage.used / usage.total * 100:.1f}%" if usage.total > 0 else "0%"
                    
                    output.append(
                        f"{partition.device[:19]:<20} {total:<10} {used:<10} "
                        f"{free:<10} {percent:<6} {partition.mountpoint}"
                    )
                except (PermissionError, OSError):
                    continue
            
            return '\n'.join(output)
        except Exception as e:
            return f"Error getting disk usage: {str(e)}"
    
    def _bytes_to_human(self, bytes_value: int) -> str:
        """Convert bytes to human readable format."""
        for unit in ['B', 'K', 'M', 'G', 'T']:
            if bytes_value < 1024.0:
                return f"{bytes_value:.1f}{unit}"
            bytes_value /= 1024.0
        return f"{bytes_value:.1f}P"