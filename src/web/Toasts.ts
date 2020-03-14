import Vue from 'vue/dist/vue.common.dev'

export
interface Toast {
	type?: "error" | "warning" | "info";
	header?: string;
	message?: string;
	timeout?: number
};

export default
class Toasts {
	private static model = new Vue({
		el: "#toasts",
		data: { toasts: [] as Toasts[] }
	});

	static add(toast: Toast): void {
		this.model.toasts.push(toast);
		if(toast.timeout !== undefined) {
			let self = this;
			setTimeout(() => {
				self.model.toasts = self.model.toasts.filter((e: Toast) => e !== toast);
			}, toast.timeout);
		}
	}
}
