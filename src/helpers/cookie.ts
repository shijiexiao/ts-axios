const cookie = {
    read(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
        // 取第三个
        return match ? decodeURIComponent(match[3]) : null
    }
}

export default cookie
