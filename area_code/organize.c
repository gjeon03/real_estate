#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <limits.h>
#include <stdlib.h>
#include <string.h>
#  define BUFFER_SIZE 1

char	*ft_strjoin(char const *s1, char const *s2)
{
	char	*str;
	size_t	s1_len;
	size_t	s2_len;

	if (s1 == 0 && s2 == 0)
		return (0);
	else if (s1 == 0)
		return (strdup(s2));
	else if (s2 == 0)
		return (strdup(s1));
	s1_len = strlen(s1);
	s2_len = strlen(s2);
	if (!(str = malloc(sizeof(char) * (s1_len + s2_len + 1))))
		return (0);
	strlcpy(str, s1, s1_len + 1);
	strlcat(str, s2, s1_len + s2_len + 1);
	return (str);
}

int	nl_find(char *str)
{
	size_t	i;

	i = 0;
	while (str[i])
	{
		if (str[i] == '\n')
			return (i);
		i++;
	}
	return (-1);
}

int	output_line(char **str, char **line, int i, char *buf)
{
	free(buf);
	(*str)[i] = '\0';
	*line = strdup(ft_strjoin("\"",ft_strjoin(*str, "\",")));
	free(*str);
	*str = 0;
	return (1);
}

int	read_remainder(char **str, char **line, char *buf)
{
	if (*str && nl_find(*str) >= 0)
		return (output_line(str, line, nl_find(*str), buf));
	else if (*str)
	{
		*line = *str;
		*str = 0;
		free(buf);
		return (0);
	}
	free(buf);
	*line = strdup("");
	return (0);
}

int	get_next_line(int fd, char **line)
{
	char		*buf;
	ssize_t		read_size;
	char		*str;
	char		*temp;

	if (fd < 0 || line == 0 || BUFFER_SIZE <= 0)
		return (-1);
	if (!(buf = (char *)malloc(sizeof(char) * (BUFFER_SIZE + 1))))
		return (-1);
	str = strdup("");
	while ((read_size = read(fd, buf, BUFFER_SIZE)) > 0)
	{
		buf[read_size] = '\0';
		temp = ft_strjoin(str, buf);
		free(str);
		str = temp;
		if (nl_find(str) >= 0)
			return (output_line(&str, line, 5, buf));
	}
	if (read_size < 0)
		return (-1);
	return (read_remainder(&str, line, buf));
}

int compare(char *str1, char *str2) {
	int i = 0;
	int len = strlen(str2);

	if (len < 5)
		return 1;
	if (str1[3] == '0' && str1[4] == '0' && str1[5] == '0')
		return 0;
	while (i < strlen(str1))
	{
		if (str1[i] != str2[i])
			return 1;
		i++;
	}
	return 0;
}

int main() {
	int fd_r, fd_w;
	int result;
	char *line;
	char *tmp;

	fd_r = open("area_code.txt", O_RDONLY);
	fd_w = open("correction.json", O_WRONLY | O_CREAT, 0644);
	write(fd_w, "{\n\"areaCode\" : [", strlen("{\n\"areaCode\" : ["));
	tmp = malloc(sizeof(char));
	while ((result = get_next_line(fd_r, &line)))
	{
		if (result == -1)
		{
			printf("!!!!GNL_ERROR!!!!\n");
			return (0);
		}
		if (compare(line, tmp) == 1)
		{
			free(tmp);
			tmp = strdup(line);
			write(fd_w, ft_strjoin("\n", line), strlen(ft_strjoin("\n", line)));
			// printf("%s\n", line);
		}
		free(line);
	}
	write(fd_w, "\n\"00000\"\n]\n}", strlen("\n\"00000\"\n]\n}"));
	free(tmp);
	close(fd_r);
	close(fd_w);
	return 0;
}