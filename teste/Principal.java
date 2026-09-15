import java.util.Scanner;
public class Principal {
    public static void main(String[] args) {

        try{
            Scanner sc = new Scanner(System.in);
            System.out.print("Entre com um número:\n");
            int num = sc.nextInt();
            System.out.println("Número: " + num);
            sc.close();

        }catch(Exception erro){
            System.out.println("Erro: " + erro.getMessage());
        }
    }
}